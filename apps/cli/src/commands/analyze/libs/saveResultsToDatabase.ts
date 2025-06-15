import { prisma } from "@repo/db";
import type { TscResult } from "./tscAndAnalyze";

export const saveResultsToDatabase = async (
  results: TscResult[],
): Promise<void> => {
  await prisma.scan.create({
    data: {
      repository: "org/name",
      commitSha: "sha123",
      commitMessage: "commit message 123",
      commitDate: new Date(),
      createdAt: new Date(),
      results: {
        create: results
          .filter((r) => r.status === "SUCCESS")
          .map((r) => ({
            packageName: r.package.name,
            status: "SUCCESS" as const,
            numTrace: r.numTrace,
            numType: r.numType,
            numHotSpot: r.numHotSpots,
            durationMs: r.durationMs,
            durationMsHotSpot: r.durationMsHotSpots,
            createdAt: new Date(),
          })),
      },
    },
  });
};
