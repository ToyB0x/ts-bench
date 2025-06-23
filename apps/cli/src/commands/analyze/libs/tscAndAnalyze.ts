import { stat } from "node:fs/promises";
import path from "node:path";
import { TRACE_FILES_DIR } from "../../../constants";
import { calculateHotSpotMetrics } from "./calculates";
import type { listPackages } from "./listPackages";
import { npxAnalyzeTrace, npxTscWithTrace } from "./npxCommands";
import { readAnalyzeData, readTraceFiles } from "./readFiles";

export type TscResult =
  | ({
      isCached: boolean;
      isSuccess: true;
      package: Awaited<ReturnType<typeof listPackages>>[number];
      /* trace results */
      traceNumType: number;
      traceNumTrace: number;
      traceFileSizeType: number;
      traceFileSizeTrace: number;
      /* analyze results */
      analyzeHotSpot: number;
      analyzeHotSpotMs: number;
      analyzeFileSize: number;
    } & Awaited<ReturnType<typeof npxTscWithTrace>>)
  | {
      isCached: boolean;
      isSuccess: false;
      package: Awaited<ReturnType<typeof listPackages>>[number];
      error: unknown;
    };

export const tscAndAnalyze = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  cachedPackages: string[],
): Promise<TscResult> => {
  const isCached = cachedPackages.includes(pkg.name);

  try {
    // execute tsc with trace
    const tscResults = await npxTscWithTrace(pkg, isCached);
    await npxAnalyzeTrace(pkg, isCached);

    // read results from files
    const { trace, types } = await readTraceFiles(pkg);
    const analyze = await readAnalyzeData(pkg);

    const tracePath = path.join(pkg.absolutePath, TRACE_FILES_DIR);

    return {
      isCached,
      package: pkg,
      isSuccess: true,
      /* trace results */
      traceNumType: types.length,
      traceNumTrace: trace.length,
      traceFileSizeType: (await stat(path.join(tracePath, "trace.json"))).size,
      traceFileSizeTrace: (await stat(path.join(tracePath, "types.json"))).size,
      /* analyze results */
      analyzeHotSpot: calculateHotSpotMetrics(analyze).numHotSpot,
      analyzeHotSpotMs: calculateHotSpotMetrics(analyze).durationMsHotSpot,
      analyzeFileSize: (await stat(path.join(tracePath, "analyze.json"))).size,
      ...tscResults,
    };
  } catch (error) {
    console.error(error);
    return {
      isCached,
      package: pkg,
      isSuccess: false,
      error: String(error),
    };
  }
};
