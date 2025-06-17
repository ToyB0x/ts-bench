import { type Result, prisma } from "@ts-bench/db";
import type { TscResult } from "./tscAndAnalyze";

export const showTable = async (results: TscResult[]) => {
  const recentScans = await prisma.scan.findMany({
    take: 10,
    skip: 1, // Skip the most recent scan (current scan) to avoid showing it in the table
    orderBy: {
      createdAt: "desc",
    },
    select: {
      results: true,
    },
  });

  const lastResult = recentScans.slice(0, 1).flatMap((scan) => scan.results);
  const recentResults = recentScans.flatMap((scan) => scan.results);

  console.log("```");
  console.table(
    results
      .sort((a, b) => b.durationMs - a.durationMs)
      .map((r) =>
        r.isSuccess
          ? {
              package: r.package.name,
              "types (diff recent 1 | recent 10)": `${r.numType} (${calcDiff(calcAverage(lastResult, r.package.name, "numType"), r.numType)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numType"), r.numType)})`,
              traces: `${r.numTrace} (${calcDiff(calcAverage(lastResult, r.package.name, "numTrace"), r.numTrace)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numTrace"), r.numTrace)})`,
              ms: `${r.durationMs} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMs"), r.durationMs)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
              hotSpots: `${r.numHotSpot} (${calcDiff(calcAverage(lastResult, r.package.name, "numHotSpot"), r.numHotSpot)} | ${calcDiff(calcAverage(recentResults, r.package.name, "numHotSpot"), r.numHotSpot)})`,
              hotSpotMs: `${r.durationMsHotSpot} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMsHotSpot"), r.durationMsHotSpot)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMsHotSpot"), r.durationMsHotSpot)})`,
            }
          : {
              package: r.package.name,
              ms: `${r.durationMs} (${calcDiff(calcAverage(lastResult, r.package.name, "durationMs"), r.durationMs)} | ${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
              error: String(r.error),
            },
      ),
  );
  console.log("```");
};

// calculate average values for a specific package and column with given results
const calcAverage = (
  results: Result[],
  packageName: Result["package"],
  column: keyof Pick<
    Result,
    "numTrace" | "numType" | "numHotSpot" | "durationMs" | "durationMsHotSpot"
  >,
): number => {
  const matchingResults = results.filter((r) => r.package === packageName);

  return (
    matchingResults
      .map((r) => r[column])
      .reduce((acc, value) => acc + value, 0) / matchingResults.length
  );
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
