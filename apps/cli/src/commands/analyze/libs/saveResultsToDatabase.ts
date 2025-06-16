import { prisma } from "@repo/db";
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

  await prisma.scan.create({
    data: {
      repository: repoName,
      commitHash: latest.hash,
      commitMessage: latest.message,
      commitDate: new Date(latest.date),
      createdAt: new Date(),
      results: {
        create: [
          ...results
            .filter((r) => r.isSuccess)
            .map((r) => ({
              ...r,
              package: r.package.name,
            })),
          ...results
            .filter((r) => !r.isSuccess)
            .map((r) => ({
              ...r,
              error: String(r.error),
              package: r.package.name,
              numType: 0,
              numTrace: 0,
              numHotSpot: 0,
              durationMs: r.durationMs || 0,
              durationMsHotSpot: 0,
            })),
        ],
      },
    },
  });
};
