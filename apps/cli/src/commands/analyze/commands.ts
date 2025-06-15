import { Command } from "commander";
import { checkTscPerformance } from "./checkTscPerformance";

export const makeAnalyzeCommand = () => {
  const analyze = new Command("analyze");
  analyze.description("analyze related commands.");

  analyze
    .command("tsc", { isDefault: true })
    .description("check tsc performance")
    .action(checkTscPerformance);

  return analyze;
};
