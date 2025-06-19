import { migrateDb } from "@ts-bench/db";
import { Command } from "commander";
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

  return analyze;
};
