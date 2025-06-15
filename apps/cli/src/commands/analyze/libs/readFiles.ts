import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { TRACE_FILES_DIR } from "../../../constants";
import { type listPackages, parseTraceAnalyzeResult } from "../libs";

export const readTraceFiles = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
): Promise<{
  trace: string;
  types: string;
}> => {
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
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  debug = false,
) => {
  const analyzeOutFile = path.join(
    pkg.absolutePath,
    TRACE_FILES_DIR,
    "analyze.json",
  );

  try {
    const analyzeData = await readFile(analyzeOutFile, "utf8");
    return parseTraceAnalyzeResult(analyzeData);
  } catch (e) {
    if (debug) console.error(e);
    return null;
  }
};
