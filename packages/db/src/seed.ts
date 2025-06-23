import { db } from "./client";
import { resultTbl, scanTbl } from "./schema";

const SEED_SCAN: typeof scanTbl.$inferInsert & { id: number } = {
  id: 1,
  version: "1.1.1",
  owner: "example-owner",
  repository: "https://github.com/example/repo",
  commitHash: "abcdef1234567890",
  commitMessage: "Initial commit",
  commitDate: new Date(),
  scannedAt: new Date(),
  changed: 1,
  files: 1,
  insertions: 1,
  deletions: 1,
  cpus: "arm64",
};

const SEED_RESULTS: (typeof resultTbl.$inferInsert)[] = [
  {
    package: "@repo/cli",
    isSuccess: true,
    isCached: true,
    scanId: SEED_SCAN.id,
    /* trace */
    traceNumType: 1,
    traceNumTrace: 1,
    traceFileSizeType: 1,
    traceFileSizeTrace: 1,

    /* analyze */
    analyzeHotSpot: 1,
    analyzeHotSpotMs: 1,
    analyzeFileSize: 1,

    /* diagnostics */
    files: 1,
    linesOfLibrary: 1,
    linesOfDefinitions: 1,
    linesOfTypeScript: 1,
    linesOfJavaScript: 1,
    linesOfJSON: 1,
    linesOfOther: 1,
    identifiers: 1,
    symbols: 1,
    types: 1,
    instantiations: 1,
    memoryUsed: 1,
    assignabilityCacheSize: 1,
    identityCacheSize: 1,
    subtypeCacheSize: 1,
    strictSubtypeCacheSize: 1,
    tracingTime: 1,
    ioReadTime: 1,
    parseTime: 1,
    resolveModuleTime: 1,
    resolveTypeReferenceTime: 1,
    resolveLibraryTime: 1,
    programTime: 1,
    bindTime: 1,
    checkTime: 1,
    printTime: 1,
    emitTime: 1,
    dumpTypesTime: 1,
    totalTime: 1,
    error: null,
  },
  {
    package: "@repo/db",
    isSuccess: true,
    isCached: false,
    scanId: SEED_SCAN.id,
    /* trace */
    traceNumType: 1,
    traceNumTrace: 1,
    traceFileSizeType: 1,
    traceFileSizeTrace: 1,

    /* analyze */
    analyzeHotSpot: 1,
    analyzeHotSpotMs: 1,
    analyzeFileSize: 1,

    /* diagnostics */
    files: 1,
    linesOfLibrary: 1,
    linesOfDefinitions: 1,
    linesOfTypeScript: 1,
    linesOfJavaScript: 1,
    linesOfJSON: 1,
    linesOfOther: 1,
    identifiers: 1,
    symbols: 1,
    types: 1,
    instantiations: 1,
    memoryUsed: 1,
    assignabilityCacheSize: 1,
    identityCacheSize: 1,
    subtypeCacheSize: 1,
    strictSubtypeCacheSize: 1,
    tracingTime: 1,
    ioReadTime: 1,
    parseTime: 1,
    resolveModuleTime: 1,
    resolveTypeReferenceTime: 1,
    resolveLibraryTime: 1,
    programTime: 1,
    bindTime: 1,
    checkTime: 1,
    printTime: 1,
    emitTime: 1,
    dumpTypesTime: 1,
    totalTime: 1,
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
