import { execSync } from "node:child_process";

const targetCommand = "typecheck";

export const listCachedPackagesByTurboTypeCheck = (): string[] => {
  const dryRunCommand = `turbo run ${targetCommand} --dry-run`;
  console.info(`Running command: ${dryRunCommand}`);

  try {
    // Execute the command and capture the output
    const output = execSync(dryRunCommand, { encoding: "utf-8" });
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
    .map(String);
};
