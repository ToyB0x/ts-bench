import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parseTraceAnalyzeResult } from "./parseTraceAnalyzeResult";

const fixtureData = fs.readFileSync(
  path.join(__dirname, "fixtures/analyze-result.json"),
  "utf-8",
);

describe("parseTraceAnalyzeResult", () => {
  it("should parse the fixture file correctly", () => {
    const result = parseTraceAnalyzeResult(fixtureData);

    expect(result).toBeDefined();
    expect(result.results).toHaveLength(1);
  });

  it("should extract hotSpots from fixture", () => {
    const result = parseTraceAnalyzeResult(fixtureData);
    const hotSpots = result.results[0]?.highlights.hotSpots;

    expect(hotSpots).toBeDefined();
    expect(Array.isArray(hotSpots)).toBe(true);
    expect(hotSpots).toHaveLength(7);
  });

  it("should parse first hotSpot with correct properties", () => {
    const result = parseTraceAnalyzeResult(fixtureData);
    const firstHotSpot = result.results[0]?.highlights.hotSpots[0];

    expect(firstHotSpot?.description).toBe(
      "Check file repo-monitor/apps/cli/src/commands/analyze/libs/listpackages.ts",
    );
    expect(firstHotSpot?.timeMs).toBe(22);
    expect(firstHotSpot?.path).toBe(
      "repo-monitor/apps/cli/src/commands/analyze/libs/listpackages.ts",
    );
  });

  it("should parse second hotSpot correctly", () => {
    const result = parseTraceAnalyzeResult(fixtureData);
    const secondHotSpot = result.results[0]?.highlights.hotSpots[1];

    expect(secondHotSpot?.description).toBe(
      "Check file repo-monitor/apps/cli/src/commands/analyze/checktscperformance/tscrunner.ts",
    );
    expect(secondHotSpot?.timeMs).toBe(16);
    expect(secondHotSpot?.path).toBe(
      "repo-monitor/apps/cli/src/commands/analyze/checktscperformance/tscrunner.ts",
    );
  });

  it("should parse all hotSpots with expected structure", () => {
    const result = parseTraceAnalyzeResult(fixtureData);
    const hotSpots = result.results[0]?.highlights.hotSpots;

    const expectedHotSpot = [
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/libs/listpackages.ts",
        timeMs: 22,
      },
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/checktscperformance/tscrunner.ts",
        timeMs: 16,
      },
      {
        description: "Check file repo-monitor/apps/cli/tsup.config.ts",
        timeMs: 16,
      },
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/checktscperformance/checktscperformance.ts",
        timeMs: 6,
      },
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/libs/listpackages.test.ts",
        timeMs: 5,
      },
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/checktscperformance/analyzer.ts",
        timeMs: 3,
      },
      {
        description:
          "Check file repo-monitor/apps/cli/src/commands/analyze/commands.ts",
        timeMs: 1,
      },
    ];

    expect(hotSpots).toHaveLength(expectedHotSpot.length);

    expectedHotSpot.forEach((expected, index) => {
      expect(hotSpots?.[index]?.description).toBe(expected.description);
      expect(hotSpots?.[index]?.timeMs).toBe(expected.timeMs);
      expect(hotSpots?.[index]?.path).toBeDefined();
    });
  });

  it("should parse valid trace analyze result with simple data", () => {
    const validData = JSON.stringify({
      results: [
        {
          highlights: {
            hotSpots: [
              {
                description: "Check file test.ts",
                timeMs: 10,
                path: "test.ts",
              },
            ],
          },
        },
      ],
    });

    const result = parseTraceAnalyzeResult(validData);

    expect(result).toBeDefined();
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.highlights.hotSpots).toBeDefined();
    expect(result.results[0]?.highlights.hotSpots[0]?.description).toBe(
      "Check file test.ts",
    );
    expect(result.results[0]?.highlights.hotSpots[0]?.timeMs).toBe(10);
    expect(result.results[0]?.highlights.hotSpots[0]?.path).toBe("test.ts");
  });

  it("should throw error for invalid JSON", () => {
    expect(() => parseTraceAnalyzeResult("invalid json")).toThrow();
  });

  it("should throw error for missing results field", () => {
    const invalidData = JSON.stringify({});
    expect(() => parseTraceAnalyzeResult(invalidData)).toThrow();
  });

  it("should throw error for invalid results structure", () => {
    const invalidData = JSON.stringify({
      results: "not an array",
    });
    expect(() => parseTraceAnalyzeResult(invalidData)).toThrow();
  });

  it("should throw error for missing highlights field", () => {
    const invalidData = JSON.stringify({
      results: [{}],
    });
    expect(() => parseTraceAnalyzeResult(invalidData)).toThrow();
  });

  it("should throw error for missing hotSpots field", () => {
    const invalidData = JSON.stringify({
      results: [
        {
          highlights: {},
        },
      ],
    });
    expect(() => parseTraceAnalyzeResult(invalidData)).toThrow();
  });

  it("should throw error for invalid hotSpots structure", () => {
    const invalidData = JSON.stringify({
      results: [
        {
          highlights: {
            hotSpots: [
              {
                description: "test",
                timeMs: "not a number",
                path: "test",
              },
            ],
          },
        },
      ],
    });
    expect(() => parseTraceAnalyzeResult(invalidData)).toThrow();
  });
});
