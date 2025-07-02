import type { Dirent } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface GrepResult {
  filePath: string;
  matches: string[];
}

const shouldIncludeFile = (
  fileName: string,
  fileExtensions?: string[],
): boolean => {
  return (
    !fileExtensions || fileExtensions.some((ext) => fileName.endsWith(ext))
  );
};

const grepFileContent = async (
  filePath: string,
  regex: RegExp,
): Promise<string[] | null> => {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const matches = lines.filter((line) => regex.test(line));
  return matches.length > 0 ? matches : null;
};

const processFile = async (
  filePath: string,
  regex: RegExp,
  fileExtensions?: string[],
): Promise<GrepResult | null> => {
  const fileName = path.basename(filePath);

  if (!shouldIncludeFile(fileName, fileExtensions)) {
    return null;
  }

  const matches = await grepFileContent(filePath, regex);
  return matches ? { filePath, matches } : null;
};

const processDirectoryEntry = async (
  entry: Dirent,
  currentPath: string,
  regex: RegExp,
  searchDirectory: (dirPath: string) => Promise<GrepResult[]>,
  fileExtensions?: string[],
): Promise<GrepResult[]> => {
  const fullPath = path.join(currentPath, entry.name);

  if (entry.isDirectory()) {
    return await searchDirectory(fullPath);
  }

  if (entry.isFile()) {
    const result = await processFile(fullPath, regex, fileExtensions);
    return result ? [result] : [];
  }

  return [];
};

/**
 * Recursively search a directory for files and grep them for a specific pattern.
 * (Internally node:fs promises are used to read files)
 */
export const grepFile = async (
  dirPath: string,
  pattern: string | RegExp,
  fileExtensions?: string[],
): Promise<GrepResult[]> => {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  const searchDirectory = async (
    currentPath: string,
  ): Promise<GrepResult[]> => {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      // NOTE: Using Promise.all on all directory entries can lead to high concurrency and resource exhaustion in large trees.
      // Consider using a controlled concurrency queue or for-await-of loop to limit simultaneous filesystem calls.
      const results = await Promise.all(
        entries.map((entry) =>
          processDirectoryEntry(
            entry,
            currentPath,
            regex,
            searchDirectory,
            fileExtensions,
          ),
        ),
      );
      return results.flat();
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
      return [];
    }
  };

  return await searchDirectory(dirPath);
};
