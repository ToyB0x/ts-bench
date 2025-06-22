import { Command, Option } from "@commander-js/extra-typings";
import { migrateDb } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import { listCommits } from "./libs";
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
      ).default(["pnpm install", "pnpm build"]),
    )
    // specify timeout in minutes
    .addOption(
      new Option(
        "-m, --timeout <minutes>",
        "timeout in minutes (default: 60)",
      ).default(60),
    )
    .action(async (options) => {
      console.info({ options });

      const enableForceMigrationConflict = false;
      await migrateDb(enableForceMigrationConflict);

      // list commits
      const commits = await listCommits();
      const recentCommits = commits.slice(0, Number(options.size));

      // check out to each commit
      for (const commit of recentCommits) {
        console.info(`Checking out to commit: ${commit}`);
        await simpleGit().checkout(commit.hash);

        for (const command of options.prepareCommands) {
          console.info(`Running setup command: ${command}`);

          // run setup commands via bash (eg., pnpm install, pnpm build)
          const { exec } = await import("node:child_process");
          await new Promise<void>((resolve, reject) => {
            exec(command, (error, stdout, _stderr) => {
              if (error) {
                console.error(`Error executing command: ${command}`, error);
                reject(error);
              } else {
                console.info(`Command output: ${stdout}`);
                resolve();
              }
            });
          });
        }

        // run bench
        await runBench();
      }
    });

  return analyze;
};
