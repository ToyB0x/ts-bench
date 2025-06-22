import { db } from "@ts-bench/db";

export const showTable = async () => {
  const recentScans = await db.query.scanTbl.findMany({
    limit: 2,
    orderBy: (scan, { desc }) => desc(scan.commitDate),
    with: {
      results: true,
    },
  });

  const [currentScan, prevScan] = recentScans;
  if (!currentScan) {
    console.warn("No current scan results found to show table.");
    return;
  }

  console.log("```");
  console.table(
    currentScan.results
      .sort((a, b) =>
        a.isSuccess && b.isSuccess && a.traceNumType && b.traceNumType
          ? b.traceNumType - a.traceNumType
          : b.package.localeCompare(a.package),
      )
      .map((r) =>
        r.isSuccess
          ? {
              package: r.package,
              traceTypes: `${r.traceNumType} (${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceNumType || 0, r.traceNumType || 0)})`,
              traceTypesSize: `${r.traceFileSizeType} (${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceFileSizeType || 0, r.traceFileSizeType || 0)})`,
              totalTime: `${r.totalTime}s (${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.totalTime || 0, r.totalTime || 0)})`,
              memoryUsed: `${r.memoryUsed}K (${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.memoryUsed || 0, r.memoryUsed || 0)})`,
              analyzeHotSpotMs: `${r.analyzeHotSpotMs}ms (${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.analyzeHotSpotMs || 0, r.analyzeHotSpotMs || 0)})`,
            }
          : {
              package: r.package,
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
