import type { TscResult } from "./tscAndAnalyze";

export const showTable = (results: TscResult[]): void => {
  console.log("```");
  console.table(
    results.map((result) => ({
      ...result,
      package: result.package.name,
    })),
  );
  console.log("```");
};
