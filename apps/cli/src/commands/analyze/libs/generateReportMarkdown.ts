import { writeFileSync } from "node:fs";
import { db } from "@ts-bench/db";
import tablemark from "tablemark";
import { version } from "../../../../package.json";

export const generateReportMarkdown = async (
  cpuModelAndSpeeds: string[],
  maxConcurrency: number,
  totalCPUs: number,
) => {
  const recentScans = await db.query.scanTbl.findMany({
    limit: 2,
    orderBy: (scan, { desc }) => desc(scan.commitDate),
    with: {
      results: true,
    },
  });

  const [currentScan, prevScan] = recentScans;
  if (!currentScan) {
    throw Error("No current scan results found to show table.");
  }

  let mdContent = `
**Tsc benchmark ${maxConcurrency} / ${totalCPUs} CPUs** (compared to ${prevScan ? prevScan.commitHash : "N/A"})

`;

  mdContent += tablemark(
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
              traceTypes: "Error",
              traceTypesSize: "",
              totalTime: "",
              memoryUsed: "",
              analyzeHotSpotMs: "",
            },
      ),
    {
      columns: [
        { align: "left" }, // package
        { align: "right" }, // traceTypes
        { align: "right" }, // traceTypesSize
        { align: "right" }, // totalTime
        { align: "right" }, // memoryUsed
        { align: "right" }, // analyzeHotSpotMs
        { align: "left" }, // error
      ],
    },
  );

  mdContent += `
<p align="right">v${version} (${cpuModelAndSpeeds.join(", ")})</p>
`;

  // write to ts-bench-report.md file
  const reportPath = "ts-bench-report.md";
  writeFileSync(reportPath, mdContent, "utf8");
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
