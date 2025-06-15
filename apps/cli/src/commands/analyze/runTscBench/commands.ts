import { exec } from "node:child_process";
import * as path from "node:path";
import { promisify } from "node:util";
import { TRACE_FILES_DIR } from "../../../constants";
import type { AnalyzeResult, Package } from "./types";

const execPromise = promisify(exec);

export const createTscCommand = (traceDir: string): string =>
  `npx tsc --noEmit --incremental false --generateTrace ${traceDir}`;

export const createAnalyzeCommand = (
  tracePath: string,
  outputFile: string,
): string => `npx @typescript/analyze-trace ${tracePath} > ${outputFile}`;

export const logProcessResult = (
  processName: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  result: any,
  isSuccess: boolean,
): void => {
  console.log(`[${processName}] ${isSuccess ? "successful" : "failed"}!`);
  console.log(`--- ${isSuccess ? "stdout" : "stderr"} ---`);
  console.log(result);
};

export const runTscTrace = async (
  pkg: Package,
): Promise<{ stdout: string; stderr: string }> => {
  const command = createTscCommand(TRACE_FILES_DIR);
  const { stdout, stderr } = await execPromise(command, {
    cwd: pkg.absolutePath,
  });

  logProcessResult("Main Process", stdout, true);
  if (stderr) {
    logProcessResult("Main Process", stderr, false);
  }

  return { stdout, stderr };
};

export const runAnalyzeTrace = async (pkg: Package): Promise<AnalyzeResult> => {
  const tracePath = path.join(pkg.absolutePath, TRACE_FILES_DIR);
  const analyzeOutFile = path.join(tracePath, "analyze.json");
  const command = createAnalyzeCommand(tracePath, analyzeOutFile);

  try {
    const result = await execPromise(command, { cwd: pkg.absolutePath });
    logProcessResult("Analyze Process", result, true);
    return { ...result, success: true };
  } catch (error) {
    logProcessResult("Analyze Process", error, false);
    return { success: false };
  }
};
