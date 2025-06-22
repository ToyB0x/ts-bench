import type { resultTbl } from "@ts-bench/db";
import { parseValueAndUnit } from "./parseValueAndUnit";

// type ExtendedDiagnosticsResultKey =
//   | "files"
//   | "linesOfLibrary"
//   | "linesOfDefinitions"
//   | "linesOfTypeScript"
//   | "linesOfJavaScript"
//   | "linesOfJSON"
//   | "linesOfOther"
//   | "identifiers"
//   | "symbols"
//   | "types"
//   | "instantiations"
//   | "memoryUsed"
//   | "assignabilityCacheSize"
//   | "identityCacheSize"
//   | "subtypeCacheSize"
//   | "strictSubtypeCacheSize"
//   | "tracingTime"
//   | "ioReadTime"
//   | "parseTime"
//   | "resolveModuleTime"
//   | "resolveTypeReferenceTime"
//   | "resolveLibraryTime"
//   | "programTime"
//   | "bindTime"
//   | "checkTime"
//   | "printTime"
//   | "emitTime"
//   | "dumpTypesTime"
//   | "totalTime";

const extendedDiagnosticsResultKeys = [
  "files",
  "linesOfLibrary",
  "linesOfDefinitions",
  "linesOfTypeScript",
  "linesOfJavaScript",
  "linesOfJSON",
  "linesOfOther",
  "identifiers",
  "symbols",
  "types",
  "instantiations",
  "memoryUsed",
  "assignabilityCacheSize",
  "identityCacheSize",
  "subtypeCacheSize",
  "strictSubtypeCacheSize",
  "tracingTime",
  "ioReadTime",
  "parseTime",
  "resolveModuleTime",
  "resolveTypeReferenceTime",
  "resolveLibraryTime",
  "programTime",
  "bindTime",
  "checkTime",
  "printTime",
  "emitTime",
  "dumpTypesTime",
  "totalTime",
] as const;

export const parseExtendedDiagnosticsResult = (
  resultStdout: string,
): Pick<
  typeof resultTbl.$inferInsert,
  (typeof extendedDiagnosticsResultKeys)[number]
> => {
  const extendedDiagnosticsByLines = resultStdout
    .split("\n")
    .filter((l) => l.trim().length > 0);

  const aggregatedObj: {
    // [K in (typeof extendedDiagnosticsResultKeys)[number]]: never;
    [key: string]: any;
  } = {};
  for (const line of extendedDiagnosticsByLines) {
    const [key, valueWithUnitWithWhiteSpace] = line.split(":");
    if (key && valueWithUnitWithWhiteSpace) {
      const { value } = parseValueAndUnit(valueWithUnitWithWhiteSpace.trim());
      aggregatedObj[key.trim()] = value;
    }
  }

  return aggregatedObj as any;
};
