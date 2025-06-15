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
  const command = `npx tsc --noEmit --incremental false --generateTrace ${TRACE_FILES_DIR}`;
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
  const command = `npx @typescript/analyze-trace ${tracePath} > ${analyzeOutFile}`;

  try {
    const result = await execPromise(command, { cwd: pkg.absolutePath });
    if (debug) console.log(result);
  } catch (error) {
    if (debug) console.error(error);
  }
};
