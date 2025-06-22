import { db, resultTbl, scanTbl } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import { version } from "../../../../package.json";
import type { TscResult } from "./tscAndAnalyze";

export const saveResultsToDatabase = async (
  results: TscResult[],
  cpus: string[],
): Promise<void> => {
  const gihubFullName = process.env["GITHUB_REPOSITORY"]; // e.g., ToyB0x/repo-monitor
  const [githubOwner, githubRepo] = gihubFullName
    ? gihubFullName.split("/")
    : [];

  const { value: gitRepo } = await simpleGit().getConfig("remote.origin.url");
  // git@github.com:ToyB0x/repo-monitor.git --> ToyB0x
  const owner =
    githubOwner ||
    (gitRepo
      ? gitRepo.split(":").pop()?.split("/")[0] || "unknown"
      : "unknown");

  // git@github.com:ToyB0x/repo-monitor.git --> repo-monitor
  const repoName =
    githubRepo ||
    (gitRepo
      ? gitRepo.split("/").pop()?.replace(".git", "") || "unknown"
      : "unknown");

  const { latest } = await simpleGit().log();
  if (!latest) return;

  const insertionScan: typeof scanTbl.$inferInsert = {
    version,
    owner,
    changed: latest.diff?.changed,
    files: latest.diff?.files.length,
    insertions: latest.diff?.insertions,
    deletions: latest.diff?.deletions,
    repository: repoName,
    commitHash: latest.hash,
    commitMessage: latest.message,
    commitDate: new Date(latest.date),
    scannedAt: new Date(),
    cpus: cpus.join(", "),
  };

  await db.transaction(async (tx) => {
    const scan = await tx
      .insert(scanTbl)
      .values(insertionScan)
      .onConflictDoUpdate({
        target: [scanTbl.repository, scanTbl.commitHash],
        set: insertionScan,
      })
      .returning();

    const scanId = scan[0]?.id;
    if (!scanId)
      throw new Error("Failed to create scan entry in the database.");

    const insertionResults: (typeof resultTbl.$inferInsert)[] = [
      ...results
        .filter((r) => r.isSuccess)
        .map((r) => ({
          ...r,
          scanId,
          package: r.package.name,
        })),
      ...results
        .filter((r) => !r.isSuccess)
        .map((r) => ({
          ...r,
          scanId,
          error: String(r.error),
          package: r.package.name,
          numType: 0,
          numTrace: 0,
          numHotSpot: 0,
          durationMs: r.durationMs || 0,
          durationMsHotSpot: 0,
        })),
    ];

    await tx
      .insert(resultTbl)
      .values(insertionResults)
      .onConflictDoUpdate({
        target: [resultTbl.scanId, resultTbl.package],
        set: resultTbl,
      });
  });
};
