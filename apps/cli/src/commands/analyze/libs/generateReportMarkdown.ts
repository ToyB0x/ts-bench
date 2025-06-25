import { writeFileSync } from "node:fs";
import { db } from "@ts-bench/db";
import type { TablemarkOptions } from "tablemark";
import tablemark from "tablemark";
import { version } from "../../../../package.json";
import { printSimpleTable } from "./printSimpleTable";

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

  let mdContent = `## :zap: Tsc benchmark
`;

  const tableRows = currentScan.results
    .sort((a, b) =>
      a.isSuccess && b.isSuccess && a.traceNumType && b.traceNumType
        ? b.traceNumType - a.traceNumType
        : b.package.localeCompare(a.package),
    )
    .map((r) =>
      r.isSuccess
        ? {
            package: r.package,
            traceTypes: `${r.traceNumType}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceNumType || 0, r.traceNumType || 0)}`,
            traceTypesSize: `${r.traceFileSizeType}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceFileSizeType || 0, r.traceFileSizeType || 0)}`,
            totalTime: `${r.totalTime}s${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.totalTime || 0, r.totalTime || 0)}`,
            memoryUsed: `${r.memoryUsed}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.memoryUsed || 0, r.memoryUsed || 0)}`,
            // analyzeHotSpotMs: `${r.analyzeHotSpotMs}ms${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.analyzeHotSpotMs || 0, r.analyzeHotSpotMs || 0)}`,
          }
        : {
            package: r.package,
            traceTypes: "Error",
            traceTypesSize: "",
            totalTime: "",
            memoryUsed: "",
            // analyzeHotSpotMs: "",
          },
    );

  const tables = {
    plus: tableRows.filter((r) => r.traceTypes.includes("+")),
    minus: tableRows.filter((r) => r.traceTypes.includes("-")),
    noChange: tableRows.filter(
      (r) => !r.traceTypes.includes("+") && !r.traceTypes.includes("-"),
    ),
    error: tableRows.filter((r) => r.traceTypes === "Error"),
  };

  const tablemarkOptions = {
    columns: [
      { align: "left" }, // package
      { align: "right" }, // traceTypes
      { align: "right" }, // traceTypesSize
      { align: "right" }, // totalTime
      { align: "right" }, // memoryUsed
      { align: "right" }, // analyzeHotSpotMs
      { align: "left" }, // error
    ],
  } satisfies TablemarkOptions;

  let summaryText = "";
  if (!tables.plus.length && !tables.minus.length && !tables.error.length) {
    summaryText += "- This PR has no significant changes";
  } else {
    summaryText += `
- ${tables.minus.length} packages become faster
- ${tables.plus.length} packages become slower
- ${tables.error.length} packages have errors`;
  }

  mdContent += `
${summaryText}
 
${tables.minus.length ? "#### :tada: Faster packages\n" + tablemark(tables.minus, tablemarkOptions) : ""}
${tables.plus.length ? "#### :rotating_light: Slower packages \n" + tablemark(tables.plus, tablemarkOptions) : ""}

<p align="right">Compared to ${prevScan ? prevScan.commitHash : "N/A"}</p>

---

<details><summary><strong>Open Details</strong></summary>

- TSC Benchmark version: ${version}
- CPU: ${cpuModelAndSpeeds.join(", ")} (${maxConcurrency} / ${totalCPUs})

${tables.noChange.length ? "<details><summary>Open: No change pakcages</summary>\n\n" + tablemark(tables.noChange, tablemarkOptions) + "</details>" : ""}

${tables.error.length ? "<details><summary>Open: Error packages</summary>\n\n" + tablemark(tables.error, tablemarkOptions) + "</details>" : ""}

<details><summary>Open Full Analysis</summary>
<pre>
# Current
${printSimpleTable(currentScan.results).trim()}
# Prev
${prevScan ? printSimpleTable(prevScan.results).trim() : "N/A"}
</pre>
</details>

</details>
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
  const diffFixedLength = Math.abs(diff).toFixed(1);
  if (diffFixedLength === "0" || diffFixedLength === "0.0") return ""; // No change, return empty string

  const sign = diff >= 0 ? "+" : "-";
  return ` (${sign}${diffFixedLength}%)`; // eg: 半角スペース (1.1%)
};
