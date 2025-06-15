import type { TscResult } from "./tscAndAnalyze";

export const showTable = (results: TscResult[]): void => {
  console.log("```");
  console.table(
    results
      .sort((a, b) => b.durationMs - a.durationMs)
      .map((result) =>
        result.isSuccess
          ? {
              package: result.package.name,
              ms: result.durationMs,
              traces: result.numTrace,
              types: result.numType,
              hotSpots: result.numHotSpot,
              hotSpotMs: result.durationMsHotSpot,
            }
          : {
              package: result.package.name,
              ms: result.durationMs,
              error: String(result.error),
            },
      ),
  );
  console.log("```");
};
