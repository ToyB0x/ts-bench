import { describe, expect, it } from "vitest";
import { parseValueAndUnit } from "./parseValueAndUnit";

// Example data
// 'Files:                         618',
//     'Lines of Library:            41836',
//     'Lines of Definitions:       127137',
//     'Lines of TypeScript:          1068',
//     'Lines of JavaScript:             0',
//     'Lines of JSON:                  44',
//     'Lines of Other:                  0',
//     'Identifiers:                186597',
//     'Symbols:                    203309',
//     'Types:                       71049',
//     'Instantiations:             926111',
//     'Memory used:               285146K',
//     'Assignability cache size:    15536',
//     'Identity cache size:           181',
//     'Subtype cache size:            139',
//     'Strict subtype cache size:      35',
//     'Tracing time:                0.03s',
//     'I/O Read time:               0.04s',
//     'Parse time:                  0.28s',
//     'ResolveModule time:          0.10s',
//     'ResolveTypeReference time:   0.00s',
//     'ResolveLibrary time:         0.01s',
//     'Program time:                0.51s',
//     'Bind time:                   0.21s',
//     'Check time:                  0.69s',
//     'printTime time:              0.00s',
//     'Emit time:                   0.00s',
//     'Dump types time:             0.99s',
//     'Total time:                  1.41s',

describe("parseValueAndUnit", () => {
  it.each([
    // Valid cases with units
    { input: "618", expected: { value: 618, unit: null } },
    { input: "41836", expected: { value: 41836, unit: null } },
    { input: "127137", expected: { value: 127137, unit: null } },
    { input: "285146K", expected: { value: 285146, unit: "K" } },
    { input: "0.03s", expected: { value: 0.03, unit: "s" } },
    { input: "0.04s", expected: { value: 0.04, unit: "s" } },
    { input: "0.28s", expected: { value: 0.28, unit: "s" } },
    { input: "1.41s", expected: { value: 1.41, unit: "s" } },
    { input: "100px", expected: { value: 100, unit: "px" } },
    { input: "50%", expected: { value: 50, unit: "%" } },
    { input: "3.14rem", expected: { value: 3.14, unit: "rem" } },
    { input: "0.5em", expected: { value: 0.5, unit: "em" } },
    { input: "1024KB", expected: { value: 1024, unit: "KB" } },
    { input: "5.2GB", expected: { value: 5.2, unit: "GB" } },
    { input: "200ms", expected: { value: 200, unit: "ms" } },
    { input: "360deg", expected: { value: 360, unit: "deg" } },
    { input: "12pt", expected: { value: 12, unit: "pt" } },

    // Valid cases without units
    { input: "42", expected: { value: 42, unit: null } },
    { input: "0", expected: { value: 0, unit: null } },
    { input: "3.14159", expected: { value: 3.14159, unit: null } },
    { input: "0.001", expected: { value: 0.001, unit: null } },
    { input: "1000", expected: { value: 1000, unit: null } },
  ])("should parse '$input' correctly", ({ input, expected }) => {
    const result = parseValueAndUnit(input);
    expect(result).toEqual(expected);
  });

  it.each([
    // Invalid cases
    { input: "", error: "Value string does not match expected format" },
    { input: "abc", error: "Value string does not match expected format" },
  ])("should throw error for invalid input '$input'", ({ input, error }) => {
    expect(() => parseValueAndUnit(input)).toThrow(error);
  });
});
