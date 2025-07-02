import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface GrepResult {
  filePath: string;
  matches: string[];
}

/**
 * Recursively search a directory for files and grep them for a specific pattern.
 * (Internally node:fs promises are used to read files)
 */
export const grepFile = async (
  dirPath: string,
  pattern: string | RegExp,
  fileExtensions?: string[],
): Promise<GrepResult[]> => {
  const results: GrepResult[] = [];
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  const searchDirectory = async (currentPath: string): Promise<void> => {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          await searchDirectory(fullPath);
        } else if (entry.isFile()) {
          const shouldInclude = !fileExtensions || 
            fileExtensions.some(ext => entry.name.endsWith(ext));

          if (shouldInclude) {
            try {
              const content = await fs.readFile(fullPath, "utf-8");
              const lines = content.split("\n");
              const matches = lines.filter((line) => regex.test(line));

              if (matches.length > 0) {
                results.push({ filePath: fullPath, matches });
              }
            } catch (error) {
              console.error(`Error reading file ${fullPath}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
  };

  await searchDirectory(dirPath);
  return results;
};
