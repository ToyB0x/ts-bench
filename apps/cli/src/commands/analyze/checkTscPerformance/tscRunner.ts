import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { TRACE_FILES_DIR } from "../../../constants";
import { type listPackages, parseTraceAnalyzeResult } from "../libs";

const execPromise = promisify(exec);

type TscResult =
  | {
      package: Awaited<ReturnType<typeof listPackages>>[number];
      status: "SUCCESS";
      numTrace: number;
      numType: number;
      numHotSpots: number;
      durationMs: number;
      durationMsHotSpots: number;
    }
  | {
      package: Awaited<ReturnType<typeof listPackages>>[number];
      status: "FAILURE";
      durationMs: number;
      error: unknown;
    };

export const runTscForPackage = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
): Promise<TscResult> => {
  console.log(`[START] ${pkg.name}`);

  const startTime = process.hrtime.bigint();

  try {
    const commandTscTrace = `npx tsc --noEmit --incremental false --generateTrace ${TRACE_FILES_DIR}`;
    const { stdout, stderr } = await execPromise(commandTscTrace, {
      cwd: pkg.absolutePath,
    });

    // 完了後に標準出力を表示
    console.log("[Main Process] commandTsc successful!");
    console.log("--- stdout ---");
    console.log(stdout);

    // 標準エラー出力があれば表示
    if (stderr) {
      console.log("--- stderr ---");
      console.error(stderr);
    }
    const durationMs = calculateDuration(startTime);

    const analyzeOutFile = `${pkg.absolutePath}/${TRACE_FILES_DIR}/analyze.json`;
    const commandAnalyzeTrace = `npx @typescript/analyze-trace ${pkg.absolutePath}/${TRACE_FILES_DIR} > ${analyzeOutFile}`;
    const analyzeResult = await execPromise(commandAnalyzeTrace, {
      cwd: pkg.absolutePath,
    })
      .then((r) => ({
        ...r,
        success: true,
      }))
      .catch((r) => ({
        ...r,
        success: false,
      }));

    if (analyzeResult.success) {
      // 完了後に標準出力を表示
      console.log("[Analyze Process] commandAnalyzeTrace successful!");
      console.log("--- analyzeStdout ---");
      console.log(analyzeResult);
    } else {
      console.log("--- analyzeStderr ---");
      console.error(analyzeResult);
    }

    // Read the ./trace/trace.json as Json with fs
    const traceFilePath = `${pkg.absolutePath}/${TRACE_FILES_DIR}/trace.json`;
    const traceData = await readFile(traceFilePath, "utf8");

    // Read the ./trace/types.json as Json
    const typesFilePath = `${pkg.absolutePath}/${TRACE_FILES_DIR}/types.json`;
    const typesData = await readFile(typesFilePath, "utf8");

    // Read the analyzeOutFile
    const analyzeData = analyzeResult.success
      ? await readFile(analyzeOutFile, "utf8")
      : null;
    const parsedAnalyzeData = analyzeData
      ? parseTraceAnalyzeResult(analyzeData)
      : null;

    console.log(`[SUCCESS] ${pkg.name} in ${durationMs.toFixed(2)}ms`);
    return {
      package: pkg,
      status: "SUCCESS",
      numTrace: JSON.parse(traceData).length,
      numType: JSON.parse(typesData).length,
      numHotSpots: parsedAnalyzeData
        ? parsedAnalyzeData.results.flatMap(
            (result) => result.highlights.hotSpots,
          ).length
        : 0,
      durationMs,
      durationMsHotSpots: parsedAnalyzeData
        ? parsedAnalyzeData.results
            .flatMap((result) =>
              result.highlights.hotSpots.map((hotSpot) => hotSpot.timeMs),
            )
            .reduce((acc, timeMs) => acc + timeMs, 0)
        : 0,
    };
  } catch (error) {
    const durationMs = calculateDuration(startTime);

    console.error(`[FAILURE] ${pkg.name} in ${durationMs.toFixed(2)}ms`, error);
    return {
      package: pkg,
      status: "FAILURE",
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const calculateDuration = (startTime: bigint): number => {
  const endTime = process.hrtime.bigint();
  return Number(endTime - startTime) / 1_000_000;
};
