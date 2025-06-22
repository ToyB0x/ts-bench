import { exec } from "node:child_process";
import * as path from "node:path";
import { promisify } from "node:util";
import { TRACE_FILES_DIR } from "../../../constants";
import type { listPackages } from "./listPackages";

const execPromise = promisify(exec);

export const npxTscWithTrace = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  debug = false,
) => {
  // TODO: add option to set maxOldSpaceSize via CLI argument
  const maxOldSpaceSize = 6144; // 6GB, adjust as needed
  // TODO: consider using extendedDiagnostics option for more detailed diagnostics
  const command = `NODE_OPTIONS=--max-old-space-size=${maxOldSpaceSize} npx tsc --noEmit --incremental false --generateTrace ${TRACE_FILES_DIR}`;
  const { stdout, stderr } = await execPromise(command, {
    cwd: pkg.absolutePath,
  });

  if (debug) {
    console.log(stdout);
    console.error(stderr);
  }
};

export const npxAnalyzeTrace = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  debug = false,
) => {
  const tracePath = path.join(pkg.absolutePath, TRACE_FILES_DIR);
  const analyzeOutFile = path.join(tracePath, "analyze.json");

  // Available options for @typescript/analyze-trace:
  // https://github.com/microsoft/typescript-analyze-trace
  const SKIP_MILLIS = 100; // DEFAULT: 100
  const FORCE_MILLIS = 150; // DEFAULT: 500
  const command = `npx @typescript/analyze-trace ${tracePath} > ${analyzeOutFile} --skipMillis ${SKIP_MILLIS} --forceMillis ${FORCE_MILLIS} --json`;

  try {
    const result = await execPromise(command, { cwd: pkg.absolutePath });
    if (debug) console.log(result);
  } catch (error) {
    if (debug) console.error(error);
  }
};
