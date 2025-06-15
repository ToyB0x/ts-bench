import { calculateDuration, calculateHotSpotMetrics } from "./calculates";
import type { listPackages } from "./listPackages";
import { npxAnalyzeTrace, npxTscWithTrace } from "./npxCommands";
import { readAnalyzeData, readTraceFiles } from "./readFiles";

export type TscResult =
  | {
      status: "SUCCESS";
      package: Awaited<ReturnType<typeof listPackages>>[number];
      numTrace: number;
      numType: number;
      numHotSpot: number;
      durationMs: number;
      durationMsHotSpot: number;
    }
  | {
      status: "FAILURE";
      package: Awaited<ReturnType<typeof listPackages>>[number];
      durationMs: number;
      error: unknown;
    };

export const tscAndAnalyze = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
): Promise<TscResult> => {
  const startTime = process.hrtime.bigint();

  try {
    // execute tsc with trace
    await npxTscWithTrace(pkg);
    await npxAnalyzeTrace(pkg);

    // read results from files
    const { trace, types } = await readTraceFiles(pkg);
    const analyze = await readAnalyzeData(pkg);

    return {
      package: pkg,
      status: "SUCCESS",
      numTrace: trace.length,
      numType: types.length,
      numHotSpot: calculateHotSpotMetrics(analyze).numHotSpot,
      durationMs: calculateDuration(startTime),
      durationMsHotSpot: calculateHotSpotMetrics(analyze).durationMsHotSpot,
    };
  } catch (error) {
    return {
      package: pkg,
      status: "FAILURE",
      durationMs: calculateDuration(startTime),
      error: String(error),
    };
  }
};
