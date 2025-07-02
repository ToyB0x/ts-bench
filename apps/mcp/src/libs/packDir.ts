import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import { type CliOptions, runCli } from "repomix";

export const packDir = async (dirPath: string): Promise<string> => {
  const outputFilePath = `repomix-output-${randomUUID()}.md`;

  const options = {
    output: outputFilePath,
    parsableStyle: true,
    compress: true,
    removeComments: true,
    removeEmptyLines: true,
    style: "markdown",
    quiet: true,
    include: ["**/*.ts", "**/*.tsx"].join(","),
  } satisfies CliOptions;

  try {
    const result = await runCli([dirPath], process.cwd(), options);
    if (!result) {
      throw new Error("Failed to pack the project");
    }

    // Read the generated markdown file
    return await fs.readFile(outputFilePath, "utf-8");
  } finally {
    // Clean up the output file
    await fs.rm(outputFilePath, { force: true });
  }
};
