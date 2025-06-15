import type { parseTraceAnalyzeResult } from "./parseTraceAnalyzeResult";

export const calculateDuration = (startTime: bigint): number => {
  const endTime = process.hrtime.bigint();
  return Number(endTime - startTime) / 1_000_000;
};

export const calculateHotSpotMetrics = (
  parsedAnalyzeData: ReturnType<typeof parseTraceAnalyzeResult> | null,
) => {
  if (!parsedAnalyzeData) return { numHotSpot: 0, durationMsHotSpot: 0 };

  const allHotSpot = parsedAnalyzeData.results.flatMap(
    (result) => result.highlights.hotSpots,
  );

  return {
    numHotSpot: allHotSpot.length,
    durationMsHotSpot: allHotSpot.reduce(
      (acc: number, hotSpot) => acc + hotSpot.timeMs,
      0,
    ),
  };
};
