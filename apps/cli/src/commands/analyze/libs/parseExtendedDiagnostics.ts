import { getTableColumns, resultTbl } from "@ts-bench/db";
import { parseValueAndUnit } from "./parseValueAndUnit";

const extendedDiagnosticsResultKeys = Object.keys(
  getTableColumns(resultTbl),
) as ExtendedDiagnosticsResultKey[];

type ExtendedDiagnosticsResultKey =
  | "files"
  | "linesOfLibrary"
  | "linesOfDefinitions"
  | "linesOfTypeScript"
  | "linesOfJavaScript"
  | "linesOfJSON"
  | "linesOfOther"
  | "identifiers"
  | "symbols"
  | "types"
  | "instantiations"
  | "memoryUsed"
  | "assignabilityCacheSize"
  | "identityCacheSize"
  | "subtypeCacheSize"
  | "strictSubtypeCacheSize"
  | "tracingTime"
  | "ioReadTime"
  | "parseTime"
  | "resolveModuleTime"
  | "resolveTypeReferenceTime"
  | "resolveLibraryTime"
  | "programTime"
  | "bindTime"
  | "checkTime"
  | "printTime"
  | "emitTime"
  | "dumpTypesTime"
  | "totalTime";

// const extendedDiagnosticsResultKeys = [
//   "files",
//   "Lines of Library",
//   "linesOfDefinitions",
//   "linesOfTypeScript",
//   "linesOfJavaScript",
//   "linesOfJSON",
//   "linesOfOther",
//   "identifiers",
//   "symbols",
//   "types",
//   "instantiations",
//   "memoryUsed",
//   "assignabilityCacheSize",
//   "identityCacheSize",
//   "subtypeCacheSize",
//   "strictSubtypeCacheSize",
//   "tracingTime",
//   "ioReadTime",
//   "parseTime",
//   "resolveModuleTime",
//   "resolveTypeReferenceTime",
//   "resolveLibraryTime",
//   "programTime",
//   "bindTime",
//   "checkTime",
//   "printTime",
//   "emitTime",
//   "dumpTypesTime",
//   "totalTime",
// ] as const;

export const parseExtendedDiagnosticsResult = (
  resultStdout: string,
): Pick<typeof resultTbl.$inferInsert, ExtendedDiagnosticsResultKey> => {
  const extendedDiagnosticsByLines = resultStdout
    .split("\n")
    .filter((l) => l.trim().length > 0); // 最後の空行を除外

  const aggregatedObj: {
    // [K in (typeof extendedDiagnosticsResultKeys)[number]]: never;
    [key: string]: number;
  } = {};
  for (const line of extendedDiagnosticsByLines) {
    const [keyWithWhiteSpace, valueWithUnitWithWhiteSpace] = line.split(":");

    // match table key linesOfLibrary to raw string "Lines of Library"
    const matchedKey = extendedDiagnosticsResultKeys.find(
      (diagKey) =>
        diagKey.toLowerCase() ===
        keyWithWhiteSpace?.trim().replaceAll(" ", "").toLowerCase(),
    );

    if (!matchedKey) continue;
    if (!valueWithUnitWithWhiteSpace) continue;

    const { value } = parseValueAndUnit(valueWithUnitWithWhiteSpace.trim());
    aggregatedObj[matchedKey] = value;
  }

  return aggregatedObj;
};
