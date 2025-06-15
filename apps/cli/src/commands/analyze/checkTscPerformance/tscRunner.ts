import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { TRACE_FILES_DIR } from "../../../constants";
import type { listPackages } from "../libs";

const execPromise = promisify(exec);

type TscResult =
  | {
      package: Awaited<ReturnType<typeof listPackages>>[number];
      status: "SUCCESS";
      durationMs: number;
      numTrace: number;
      numType: number;
    }
  | {
      package: Awaited<ReturnType<typeof listPackages>>[number];
      status: "FAILURE";
      durationMs: number;
      error: unknown;
    };

export const runTscForPackage = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  command: string,
): Promise<TscResult> => {
  console.log(`[START] ${pkg.name}`);

  const startTime = process.hrtime.bigint();

  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: pkg.absolutePath,
    });

    // 完了後に標準出力を表示
    console.log("[Main Process] Command successful!");
    console.log("--- stdout ---");
    console.log(stdout);

    // 標準エラー出力があれば表示
    if (stderr) {
      console.log("--- stderr ---");
      console.error(stderr);
    }
    // Read the ./trace/trace.json as Json with fs
    const traceFilePath = `${pkg.absolutePath}/${TRACE_FILES_DIR}/trace.json`;
    const traceData = await readFile(traceFilePath, "utf8");

    // Read the ./trace/types.json as Json
    const typesFilePath = `${pkg.absolutePath}/${TRACE_FILES_DIR}/types.json`;
    const typesData = await readFile(typesFilePath, "utf8");

    const durationMs = calculateDuration(startTime);

    console.log(`[SUCCESS] ${pkg.name} in ${durationMs.toFixed(2)}ms`);
    return {
      package: pkg,
      status: "SUCCESS",
      numTrace: JSON.parse(traceData).length,
      numType: JSON.parse(typesData).length,
      durationMs,
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
