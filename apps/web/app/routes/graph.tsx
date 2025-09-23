import { and, desc, eq, gte, resultTbl, scanTbl } from "@ts-bench/db/browser";
import { Link } from "react-router";
import { getDb } from "~/clients/db";
import { ChartAreaInteractive } from "~/components/parts/chart-area";
import { ChartAreaInteractiveExample } from "~/components/parts/chart-area-example";
import type { Route } from "./+types/graph";

// Type definitions
type Result = {
  id: number;
  package: string;
  isSuccess: boolean;
  isCached: boolean;
  scanId: number;
  types: number | null;
  instantiations: number | null;
  totalTime: number | null;
  files: number | null;
  linesOfLibrary: number | null;
  linesOfDefinitions: number | null;
  linesOfTypeScript: number | null;
  identifiers: number | null;
  symbols: number | null;
  memoryUsed: number | null;
  checkTime: number | null;
  bindTime: number | null;
  programTime: number | null;
};

type ScanWithResults = {
  id: number;
  version: string;
  owner: string;
  repository: string;
  changed: number | null;
  files: number | null;
  insertions: number | null;
  deletions: number | null;
  commitHash: string;
  commitMessage: string;
  commitDate: Date;
  scannedAt: Date;
  cpus: string;
  aiCommentImpact: string | null;
  aiCommentReason: string | null;
  aiCommentSuggestion: string | null;
  results: Result[];
};

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  try {
    const db = await getDb();

    // Get distinct packages using Drizzle
    const packagesResult = await db
      .selectDistinct({
        package: resultTbl.package,
      })
      .from(resultTbl)
      .orderBy(resultTbl.package);

    // Get all scans with their results using Drizzle
    const scansResult = await db
      .select({
        // Scan information
        scanId: scanTbl.id,
        version: scanTbl.version,
        owner: scanTbl.owner,
        repository: scanTbl.repository,
        changed: scanTbl.changed,
        scanFiles: scanTbl.files,
        insertions: scanTbl.insertions,
        deletions: scanTbl.deletions,
        commitHash: scanTbl.commitHash,
        commitMessage: scanTbl.commitMessage,
        commitDate: scanTbl.commitDate,
        scannedAt: scanTbl.scannedAt,
        cpus: scanTbl.cpus,
        aiCommentImpact: scanTbl.aiCommentImpact,
        aiCommentReason: scanTbl.aiCommentReason,
        aiCommentSuggestion: scanTbl.aiCommentSuggestion,
        // Result information
        resultId: resultTbl.id,
        package: resultTbl.package,
        isSuccess: resultTbl.isSuccess,
        isCached: resultTbl.isCached,
        types: resultTbl.types,
        instantiations: resultTbl.instantiations,
        totalTime: resultTbl.totalTime,
        files: resultTbl.files,
        linesOfLibrary: resultTbl.linesOfLibrary,
        linesOfDefinitions: resultTbl.linesOfDefinitions,
        linesOfTypeScript: resultTbl.linesOfTypeScript,
        identifiers: resultTbl.identifiers,
        symbols: resultTbl.symbols,
        memoryUsed: resultTbl.memoryUsed,
        checkTime: resultTbl.checkTime,
        bindTime: resultTbl.bindTime,
        programTime: resultTbl.programTime,
      })
      .from(scanTbl)
      .leftJoin(resultTbl, eq(scanTbl.id, resultTbl.scanId))
      .orderBy(scanTbl.commitDate);

    // Get latest scan (Drizzle advanced query example)
    const latestScan = await db
      .select()
      .from(scanTbl)
      .orderBy(desc(scanTbl.commitDate))
      .limit(1);

    // Detect performance issues (threshold-based filtering)
    const performanceIssues = await db
      .select({
        package: resultTbl.package,
        totalTime: resultTbl.totalTime,
        instantiations: resultTbl.instantiations,
        commitHash: scanTbl.commitHash,
        commitDate: scanTbl.commitDate,
      })
      .from(resultTbl)
      .innerJoin(scanTbl, eq(resultTbl.scanId, scanTbl.id))
      .where(
        and(
          gte(resultTbl.totalTime, 5), // More than 5 seconds
          gte(resultTbl.instantiations, 1000000), // More than 1M instantiations
        ),
      )
      .orderBy(desc(resultTbl.totalTime));

    // Group results by scan for compatibility with existing UI
    const scansMap = new Map<number, ScanWithResults>();

    for (const row of scansResult) {
      if (!scansMap.has(row.scanId)) {
        scansMap.set(row.scanId, {
          id: row.scanId,
          version: row.version,
          owner: row.owner,
          repository: row.repository,
          changed: row.changed,
          files: row.scanFiles,
          insertions: row.insertions,
          deletions: row.deletions,
          commitHash: row.commitHash,
          commitMessage: row.commitMessage,
          commitDate: row.commitDate,
          scannedAt: row.scannedAt,
          cpus: row.cpus,
          aiCommentImpact: row.aiCommentImpact,
          aiCommentReason: row.aiCommentReason,
          aiCommentSuggestion: row.aiCommentSuggestion,
          results: [],
        });
      }

      if (
        row.resultId &&
        row.package !== null &&
        row.isSuccess !== null &&
        row.isCached !== null
      ) {
        const scan = scansMap.get(row.scanId);
        if (scan) {
          scan.results.push({
            id: row.resultId,
            package: row.package,
            isSuccess: row.isSuccess,
            isCached: row.isCached,
            scanId: row.scanId,
            types: row.types,
            instantiations: row.instantiations,
            totalTime: row.totalTime,
            files: row.files,
            linesOfLibrary: row.linesOfLibrary,
            linesOfDefinitions: row.linesOfDefinitions,
            linesOfTypeScript: row.linesOfTypeScript,
            identifiers: row.identifiers,
            symbols: row.symbols,
            memoryUsed: row.memoryUsed,
            checkTime: row.checkTime,
            bindTime: row.bindTime,
            programTime: row.programTime,
          });
        }
      }
    }

    const scansWithResults = Array.from(scansMap.values());

    return {
      packages: packagesResult,
      scansWithResults,
      latestScan: latestScan[0],
      performanceIssues,
    };
  } catch (error) {
    console.error("Failed to load data:", error);
    // Return empty data on error
    return {
      packages: [],
      scansWithResults: [],
    };
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { packages, scansWithResults } = loaderData;

  return (
    <>
      <div className="mt-4 p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 全パッケージの指標の合計を表示 */}
        <ChartAreaInteractive
          data={scansWithResults.map((scan) => {
            // calculate the total values with each metrics for all packages
            return scan.results.reduce(
              (acc, result) => {
                // Sum up the metrics for all packages
                acc.totalTime += result.totalTime || 0;
                acc.types += result.types || 0;
                acc.instantiations += result.instantiations || 0;
                return acc;
              },
              {
                ...scan,
                package: "⭐️ ALL Packages",
                types: 0,
                instantiations: 0,
                totalTime: 0,
              },
            );
          })}
        />

        {packages.map(({ package: pkg }) => (
          <ChartAreaInteractive
            key={pkg}
            data={scansWithResults.flatMap((scan) => {
              const filteredResults = scan.results.filter(
                (result) => result.package === pkg,
              );

              return filteredResults.map((result) => ({
                ...result,
                ...scan,
              }));
            })}
          />
        ))}

        <ChartAreaInteractiveExample />
      </div>

      <div className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Packages Detail Insight</h2>
        <ul className="list-disc mt-4 pl-6">
          {packages.map(({ package: pkg }) => (
            <li key={pkg}>
              <Link to={`./${pkg}`}>{pkg}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
