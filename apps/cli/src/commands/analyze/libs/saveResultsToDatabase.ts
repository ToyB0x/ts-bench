import { db, resultTbl, scanTbl } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import type { TscResult } from "./tscAndAnalyze";

export const saveResultsToDatabase = async (
  results: TscResult[],
): Promise<void> => {
  const { value: gitRepo } = await simpleGit().getConfig("remote.origin.url");
  // git@github.com:ToyB0x/repo-monitor.git --> repo-monitor
  const repoName = gitRepo
    ? gitRepo.split("/").pop()?.replace(".git", "") || "unknown"
    : "unknown";

  const { latest } = await simpleGit().log();
  if (!latest) return;

  await db.transaction(async (tx) => {
    const scan = await tx
      .insert(scanTbl)
      .values({
        repository: repoName,
        commitHash: latest.hash,
        commitMessage: latest.message,
        commitDate: new Date(latest.date),
        createdAt: new Date(),
      })
      .returning();

    const scanId = scan[0]?.id;
    if (!scanId)
      throw new Error("Failed to create scan entry in the database.");

    await tx.insert(resultTbl).values([
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
    ]);
  });
};
