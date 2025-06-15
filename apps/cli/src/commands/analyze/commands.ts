import { Command } from "commander";

export const makeAnalyzeCommand = () => {
  const analyze = new Command("analyze");
  analyze.description("analyze related commands.");

  analyze
    .command("tsc", { isDefault: true })
    .description("check tsc performance")
    .action(async () => {
      console.log("Running tsc performance check...");
    });

  return analyze;
};
