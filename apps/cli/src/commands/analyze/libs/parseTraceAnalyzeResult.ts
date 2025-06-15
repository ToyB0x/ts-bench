import * as v from "valibot";

const traceAnalyzeResultSchema = v.object({
  results: v.array(
    v.object({
      highlights: v.object({
        hotSpots: v.array(
          v.object({
            description: v.string(),
            timeMs: v.number(),
            path: v.string(),
          }),
        ),
      }),
    }),
  ),
});

export const parseTraceAnalyzeResult = (jsonStr: string) => {
  return v.parse(traceAnalyzeResultSchema, JSON.parse(jsonStr));
};
