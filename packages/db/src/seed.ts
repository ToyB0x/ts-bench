import { db } from "./client";
import { resultTbl, scanTbl } from "./schema";

const SEED_SCAN: typeof scanTbl.$inferInsert & { id: number } = {
  id: 1,
  repository: "https://github.com/example/repo",
  commitHash: "abcdef1234567890",
  commitMessage: "Initial commit",
  commitDate: new Date(),
  createdAt: new Date(),
};

const SEED_RESULTS: (typeof resultTbl.$inferInsert)[] = [
  {
    package: "@repo/cli",
    isSuccess: true,
    numTrace: 1247,
    numType: 4778,
    numHotSpot: 0,
    durationMs: 1533.330333,
    durationMsHotSpot: 0,
    scanId: SEED_SCAN.id,
    error: null,
  },
  {
    package: "@repo/db",
    isSuccess: true,
    numTrace: 711,
    numType: 3898,
    numHotSpot: 0,
    durationMs: 2550.592959,
    durationMsHotSpot: 0,
    scanId: SEED_SCAN.id,
    error: null,
  },
];

const scan = await db
  .insert(scanTbl)
  .values(SEED_SCAN)
  .onConflictDoNothing({
    target: scanTbl.id,
  })
  .returning();

console.log(scan);

const results = await db
  .insert(resultTbl)
  .values(SEED_RESULTS)
  .onConflictDoNothing({
    target: [resultTbl.scanId, resultTbl.package],
  })
  .returning();

console.log(results);
