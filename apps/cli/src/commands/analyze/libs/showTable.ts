import type { TscResult } from "./tscAndAnalyze";

export const showTable = (results: TscResult[]): void => {
  console.log("```");
  console.table(
    results
      .sort((a, b) => a.durationMs - b.durationMs)
      .map((result) => ({
        ...result,
        package: result.package.name,
      })),
    [
      "package",
      "durationMs",
      "numTrace",
      "numType",
      "durationMsHotSpots",
      "numHotSpots",
      "isSuccess",
    ],
  );
  console.log("```");
};
