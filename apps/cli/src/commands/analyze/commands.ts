import { Command } from "commander";
import { tsc } from "./tsc";

export const makeAnalyzeCommand = () => {
  const analyze = new Command("analyze");
  analyze.description("analyze related commands.");

  analyze
    .command("tsc", { isDefault: true })
    .description("check tsc performance")
    .action(tsc);

  return analyze;
};
