import { execSync } from "node:child_process";

const targetCommand = "typecheck";

export const listCachedPackagesByTurboTypeCheck = (
  workingDir: string,
): string[] => {
  const dryRunCommand = `turbo ${targetCommand} --dry-run=json`;
  console.info(`Running command: ${dryRunCommand}`);

  try {
    // Execute the command and capture the output
    const output = execSync(dryRunCommand, {
      encoding: "utf-8",
      cwd: workingDir,
    });
    return parseCachedPackages(output);
  } catch (error) {
    console.error(`Error executing command: ${dryRunCommand}`, error);
    return [];
  }
};

const parseCachedPackages = (stdout: string): string[] => {
  const dryRunJson = JSON.parse(stdout);

  const tasks = dryRunJson["tasks"];
  if (!Array.isArray(tasks)) return [];

  const targetTasks = tasks.filter((task) => task["task"] === targetCommand);

  return targetTasks
    .filter((task) => task["cache"]["status"] === "HIT")
    .map((task) => String(task["package"]));
};
