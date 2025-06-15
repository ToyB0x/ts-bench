import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { listPackages } from "../libs";

const execPromise = promisify(exec);

type TscResult = {
  package: Awaited<ReturnType<typeof listPackages>>[number];
  status: "SUCCESS" | "FAILURE";
  durationMs: number;
  error?: unknown;
};

export const runTscForPackage = async (
  pkg: Awaited<ReturnType<typeof listPackages>>[number],
  command: string,
): Promise<TscResult> => {
  console.log(`[START] ${pkg.name}`);

  const startTime = process.hrtime.bigint();

  try {
    await execPromise(command, { cwd: pkg.path });
    const durationMs = calculateDuration(startTime);

    console.log(`[SUCCESS] ${pkg.name} in ${durationMs.toFixed(2)}ms`);
    return {
      package: pkg,
      status: "SUCCESS",
      durationMs,
    };
  } catch (error) {
    const durationMs = calculateDuration(startTime);

    console.error(`[FAILURE] ${pkg.name} in ${durationMs.toFixed(2)}ms`);
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
