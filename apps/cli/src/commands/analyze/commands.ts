import { Command, Option } from "@commander-js/extra-typings";
import { migrateDb } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import { listCommits, runPreprpareCommands } from "./libs";
import { runBench } from "./runBench";

export const makeAnalyzeCommand = () => {
  const analyze = new Command("analyze");
  analyze.description("analyze related commands.");

  analyze
    .command("tsc", { isDefault: true })
    .description("check tsc performance")
    .action(async () => {
      const enableForceMigrationConflict = false;
      await migrateDb(enableForceMigrationConflict);
      await runBench();
    });

  analyze
    .command("span")
    .description("check tsc performance with multiple commits range")
    // option: specify span type (days or commits)
    .addOption(
      new Option("-t, --type <type>", "type of span (days or commits)")
        .choices(["days", "commits"])
        .default("commits"),
    )
    // option: specify span size (e.g., 10, 100, 1000)
    .addOption(
      new Option(
        "-s, --size <size>",
        "size of span (e.g., 10, 100, 1000)",
      ).default(30),
    )
    // option: specify skip commits (e.g., 0, 5, 10)
    .addOption(
      new Option(
        "-k, --skip <skip>",
        "number of commits to skip each scan (default: 0)",
      ).default(0),
    )
    // option: specify setup commands (dependencies install, build monorepo, ...)
    .addOption(
      new Option(
        "-p, --prepare-commands <commands...>",
        "prepare / setup commands to run before analyze",
      ).default(["pnpm install", "pnpm build"] as string[]),
    )
    // option: specify working directory for prepare commands
    .addOption(
      new Option(
        "-d, --working-dir <dir>",
        "working directory for prepare commands (default: current directory)",
      ).default("."),
    )
    // specify timeout in minutes
    .addOption(
      new Option(
        "-m, --timeout <minutes>",
        "timeout in minutes (default: 60)",
      ).default(60),
    )
    .action(async (options) => {
      // console.info({ options });
      const restoreBranch = await simpleGit().revparse([
        "--abbrev-ref",
        "HEAD",
      ]);

      const enableForceMigrationConflict = false;
      await migrateDb(enableForceMigrationConflict);

      // list commits
      const commits = await listCommits();
      const recentCommits = commits.slice(0, Number(options.size));

      // check out to each commit
      for (let i = 0; i < recentCommits.length; i++) {
        const commit = recentCommits[i];
        console.info(`${commit.hash} ( ${i + 1}/ ${recentCommits.length})`);
        await simpleGit().checkout(commit.hash);
        await runPreprpareCommands(options.prepareCommands, options.workingDir);
        await runBench();
      }

      // restore to the latest commit
      console.info("Restoring to the latest commit...");
      await simpleGit().checkout("HEAD");
      await simpleGit().checkout(restoreBranch);
      await runPreprpareCommands(options.prepareCommands, options.workingDir);
    });

  return analyze;
};
