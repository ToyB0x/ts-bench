import { Command, Option } from "@commander-js/extra-typings";
import { migrateDb } from "@ts-bench/db";
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

      // TODO: Implement span analysis
      // const enableForceMigrationConflict = false;
      // await migrateDb(enableForceMigrationConflict);
      // // list commits
      // // check out to each commit
      // // run setup (dependencies install, build monorepo, ...)
      // // run bench
      // await runBench();
    });

  return analyze;
};
