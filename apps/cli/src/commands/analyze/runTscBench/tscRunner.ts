import { npxAnalyzeTrace, npxTscWithTrace } from "../libs";
import { readAnalyzeData, readTraceFiles } from "./fileOperations";
import { calculateDuration, calculateHotSpotMetrics } from "./metrics";
import type { Package, TscResult } from "./types";

export const runTscForPackage = async (pkg: Package): Promise<TscResult> => {
  const startTime = process.hrtime.bigint();

  try {
    await npxTscWithTrace(pkg);

    const analyzeResult = await npxAnalyzeTrace(pkg);
    const parsedAnalyzeData = await readAnalyzeData(pkg, analyzeResult);

    const { numHotSpots, durationMsHotSpots } = parsedAnalyzeData
      ? calculateHotSpotMetrics(parsedAnalyzeData)
      : {
          numHotSpots: 0,
          durationMsHotSpots: 0,
        };
    const durationMs = calculateDuration(startTime);

    // read results from files
    const { trace, types } = await readTraceFiles(pkg);

    return {
      package: pkg,
      status: "SUCCESS",
      numTrace: trace.length,
      numType: types.length,
      numHotSpots,
      durationMs,
      durationMsHotSpots,
    };
  } catch (error) {
    const durationMs = calculateDuration(startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // console.error(`[FAILURE] ${pkg.name} in ${durationMs.toFixed(2)}ms`, error);

    return {
      package: pkg,
      status: "FAILURE",
      durationMs,
      error: errorMessage,
    };
  }
};
