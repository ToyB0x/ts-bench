import { db } from "@ts-bench/db";
import type { TscResult } from "./tscAndAnalyze";

export const showTable = async (results: TscResult[]) => {
  const recentScans = await db.query.scanTbl.findMany({
    limit: 10,
    offset: 1, // Skip the most recent scan (current scan) to avoid showing it in the table
    orderBy: (scan, { desc }) => desc(scan.commitDate),
    with: {
      results: true,
    },
  });

  const lastResult = recentScans.slice(0, 1).flatMap((scan) => scan.results)[0];
  if (!lastResult) {
    console.warn("No previous results found to compare with.");
    return;
  }

  console.log("```");
  console.table(
    results
      .sort((a, b) =>
        a.isSuccess && b.isSuccess
          ? b.traceNumType - a.traceNumType
          : b.package.name.localeCompare(a.package.name),
      )
      .map((r) =>
        r.isSuccess
          ? // ? {
            //     package: r.package.name,
            //     "types (diff recent 1 | recent 10)": `${r.numType} (${calcDiff(calcAverage(lastResult, r.package.name, "numType"), r.numType)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numType"), r.numType)})`,
            //     traces: `${r.numTrace} (${calcDiff(calcAverage(lastResult, r.package.name, "numTrace"), r.numTrace)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numTrace"), r.numTrace)})`,
            //     ms: `${r.durationMs} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMs"), r.durationMs)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
            //     hotSpots: `${r.numHotSpot} (${calcDiff(calcAverage(lastResult, r.package.name, "numHotSpot"), r.numHotSpot)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numHotSpot"), r.numHotSpot)})`,
            //     hotSpotMs: `${r.durationMsHotSpot} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMsHotSpot"), r.durationMsHotSpot)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMsHotSpot"), r.durationMsHotSpot)})`,
            //   }
            // : {
            //     package: r.package.name,
            //     ms: `${r.durationMs} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMs"), r.durationMs)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
            //     error: String(r.error),
            //   },
            // NOTE: The above commented code is replaced with the following to avoid showing the recent 10 data in the table
            {
              package: r.package.name,
              traceTypes: `${r.traceNumType} (${calcDiff(lastResult.traceNumType || 0, r.traceNumType)})`,
              traceTypeSize: `${r.traceFileSizeType} (${calcDiff(lastResult.traceFileSizeType || 0, r.traceFileSizeType)})`,
              totalTime: `${r.totalTime}s (${calcDiff(lastResult.totalTime || 0, r.totalTime || 0)})`,
              memoryUsed: `${r.memoryUsed}K (${calcDiff(lastResult.memoryUsed || 0, r.memoryUsed || 0)})`,
              analyzeHotSpotMs: `${r.analyzeHotSpotMs}ms (${calcDiff(lastResult.analyzeHotSpotMs || 0, r.analyzeHotSpotMs)})`,
            }
          : {
              package: r.package.name,
              error: String(r.error),
            },
      ),
  );
  console.log("```");
};

// calculate the difference between two numbers
// - case:plus  before 100, after 121 --> +21.0%)
// - case:minus before 100, after 92 --> -8.0%)
const calcDiff = (before: number, after: number): string => {
  if (before === 0) return "N/A"; // Avoid division by zero

  const diff = ((after - before) / Math.abs(before)) * 100;
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diff).toFixed(1)}%`;
};
