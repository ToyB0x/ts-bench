import type { parseTraceAnalyzeResult } from "../libs";

export const calculateDuration = (startTime: bigint): number => {
  const endTime = process.hrtime.bigint();
  return Number(endTime - startTime) / 1_000_000;
};

export const calculateHotSpotMetrics = (
  parsedAnalyzeData: ReturnType<typeof parseTraceAnalyzeResult>,
) => {
  if (!parsedAnalyzeData) return { numHotSpots: 0, durationMsHotSpots: 0 };

  const allHotSpots = parsedAnalyzeData.results.flatMap(
    (result) => result.highlights.hotSpots,
  );

  return {
    numHotSpots: allHotSpots.length,
    durationMsHotSpots: allHotSpots.reduce(
      (acc: number, hotSpot) => acc + hotSpot.timeMs,
      0,
    ),
  };
};
