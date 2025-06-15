import { globSync } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";

type Package = {
  name: string;
  absolutePath: string;
  relativePathFromRoot: string;
};

export const listPackages = async (): Promise<Package[]> => {
  const gitRoot = await findGitRoot();
  if (!gitRoot) {
    throw new Error("Not in a git repository");
  }
  return await scanForPackages(gitRoot);
};

// This function finds the root directory of the git repository by checking for the presence of a `.git` directory.
const findGitRoot = async (): Promise<string | null> => {
  let currentDir = process.cwd();

  while (currentDir !== path.dirname(currentDir)) {
    const gitPath = path.join(currentDir, ".git");
    if (await pathExists(gitPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  const rootGitPath = path.join(currentDir, ".git");
  return (await pathExists(rootGitPath)) ? currentDir : null;
};

// This function scans for packages using fs.glob to find all package.json files
const scanForPackages = async (gitRoot: string): Promise<Package[]> => {
  const packages: Package[] = [];

  try {
    // Use glob to find all package.json files, excluding common build/cache directories
    const packageJsonPaths = globSync("**/package.json", {
      cwd: gitRoot,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.git/**",
        "**/generated/**",
      ],
    });

    await Promise.all(
      packageJsonPaths.map(async (packageJsonPath) => {
        const packageDir = path.dirname(packageJsonPath);
        const absolutePackageDir = path.join(gitRoot, packageDir);

        const packageInfo = await parsePackageJson(absolutePackageDir);
        if (packageInfo) {
          packages.push({
            name: packageInfo.name,
            absolutePath: absolutePackageDir,
            relativePathFromRoot: packageDir,
          });
        }
      }),
    );
  } catch (error) {
    console.error("Error scanning for packages:", error);
  }

  return packages;
};

// This function reads and parses the `package.json` file to extract the package name.
const parsePackageJson = async (
  packageDir: string,
): Promise<{ name: string } | null> => {
  try {
    const packageJsonPath = path.join(packageDir, "package.json");
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const packageData = JSON.parse(content);
    return packageData.name ? { name: packageData.name } : null;
  } catch (error) {
    console.error(`Error parsing package.json in ${packageDir}:`, error);
    return null;
  }
};

// This function checks if a file or directory exists at the given path.
const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
