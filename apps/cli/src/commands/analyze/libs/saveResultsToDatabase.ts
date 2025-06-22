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

  const { latest: currentCommit } = await simpleGit().log(["--shortstat"]);
  if (!currentCommit)
    throw Error("Please run this command on a clean working tree.");

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

  const insertionScan: typeof scanTbl.$inferInsert = {
    version,
    owner,
    changed: currentCommit.diff?.changed,
    files: currentCommit.diff?.files.length,
    insertions: currentCommit.diff?.insertions,
    deletions: currentCommit.diff?.deletions,
    repository: repoName,
    commitHash: currentCommit.hash,
    commitMessage: currentCommit.message,
    commitDate: new Date(currentCommit.date),
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
      ...results.map((r) => ({
        ...r,
        scanId,
        package: r.package.name,
        error: r.isSuccess ? null : String(r.error),
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
