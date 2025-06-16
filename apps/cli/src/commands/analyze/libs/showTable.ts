import { type Result, prisma } from "@repo/db";
import type { TscResult } from "./tscAndAnalyze";

export const showTable = async (results: TscResult[]) => {
  const recentScans = await prisma.scan.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      results: true,
    },
  });

  const recentResults = recentScans.flatMap((scan) => scan.results);

  console.log("```");
  console.table(
    results
      .sort((a, b) => b.durationMs - a.durationMs)
      .map((r) =>
        r.isSuccess
          ? {
              package: r.package.name,
              ms: `${r.durationMs} (${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
              traces: `${r.numTrace} (${calcDiff(calcAverage(recentResults, r.package.name, "numTrace"), r.numTrace)})`,
              types: `${r.numType} (${calcDiff(calcAverage(recentResults, r.package.name, "numType"), r.numType)})`,
              hotSpots: `${r.numHotSpot} (${calcDiff(calcAverage(recentResults, r.package.name, "numHotSpot"), r.numHotSpot)})`,
              hotSpotMs: `${r.durationMsHotSpot} (${calcDiff(calcAverage(recentResults, r.package.name, "durationMsHotSpot"), r.durationMsHotSpot)})`,
            }
          : {
              package: r.package.name,
              ms: `${r.durationMs} (${calcDiff(calcAverage(recentResults, r.package.name, "durationMs"), r.durationMs)})`,
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
) =>
  results
    .filter((r) => r.package === packageName)
    .map((r) => r[column])
    .reduce((acc, value) => acc + value, 0) / results.length;

// calculate the difference between two numbers
// - case:plus  before 100, after 121 --> +21.0%)
// - case:minus before 100, after 92 --> -8.0%)
const calcDiff = (before: number, after: number): string => {
  if (before === 0) return "";

  const diff = (after - before) / Math.abs(before);
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diff).toFixed(1)}%`;
};
