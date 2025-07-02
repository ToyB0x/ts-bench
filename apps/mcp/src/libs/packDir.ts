import { type CliOptions, runCli } from "repomix";

export const packDir = async (dirPath: string): Promise<string> => {
  const options = {
    parsableStyle: true,
    compress: true,
    removeComments: true,
    removeEmptyLines: true,
    style: "markdown",
    quiet: true,
    include: ["**/*.ts", "**/*.tsx"].join(","),
  } satisfies CliOptions;

  const result = await runCli([dirPath], process.cwd(), options);
  if (!result) {
    throw new Error("Failed to pack the project");
  }

  return JSON.stringify(result.packResult);
};
