import { prisma } from "@repo/db";
import type { TscResult } from "./tscAndAnalyze";

export const saveResultsToDatabase = async (
  results: TscResult[],
): Promise<void> => {
  prisma.scan.create({
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
            ...r,
            packageName: r.package.name,
            status: "SUCCESS",
          })),
      },
    },
  });
};
