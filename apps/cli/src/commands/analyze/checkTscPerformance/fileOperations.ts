import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { TRACE_FILES_DIR } from "../../../constants";
import { parseTraceAnalyzeResult } from "../libs";
import type { AnalyzeResult, Package } from "./types";

export const readTraceFiles = async (pkg: Package) => {
  const basePath = path.join(pkg.absolutePath, TRACE_FILES_DIR);

  const [traceData, typesData] = await Promise.all([
    readFile(path.join(basePath, "trace.json"), "utf8"),
    readFile(path.join(basePath, "types.json"), "utf8"),
  ]);

  return {
    trace: JSON.parse(traceData),
    types: JSON.parse(typesData),
  };
};

export const readAnalyzeData = async (
  pkg: Package,
  analyzeResult: AnalyzeResult,
) => {
  if (!analyzeResult.success) return null;

  const analyzeOutFile = path.join(
    pkg.absolutePath,
    TRACE_FILES_DIR,
    "analyze.json",
  );
  const analyzeData = await readFile(analyzeOutFile, "utf8");
  return parseTraceAnalyzeResult(analyzeData);
};
