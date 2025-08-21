import { exec } from "child_process";
import { fromPromise } from "neverthrow";
import { promisify } from "util";

const execPromisified = promisify(exec);

export type CommandTsc = {
  cwd: string;
  packageManager: "npm" | "yarn" | "pnpm";
  tscOptions?: string; // ひとまずは任意の文字列オプションを受け付ける
};

// TODO: add shared error type or generics
const ErrorTsc = {
  EXECUTION_ERROR: "EXECUTION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export const stepTsc = (cmd: CommandTsc) =>
  fromPromise(_stepTsc(cmd), (err) => ({
    type: ErrorTsc.UNKNOWN_ERROR,
    error: err,
  }));

const _stepTsc = async (cmd: CommandTsc) => {
  const execCommand =
    `${cmd.packageManager} tsc ${cmd.tscOptions ?? ""}`.trim();
  const result = await execPromisified(execCommand, { cwd: cmd.cwd });

  return { stdout: result.stdout, stderr: result.stderr }; // ひとまずはコマンド実行結果をStringで返す
};
