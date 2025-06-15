import * as fs from "node:fs/promises";
import * as path from "node:path";

const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".git", "generated"]);

type Package = {
  name: string;
  path: string;
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

// This function scans the directory recursively for packages by looking for `package.json` files.
const scanForPackages = async (
  dir: string,
  relativePath = "",
): Promise<Package[]> => {
  const packages: Package[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name)) {
          const fullPath = path.join(dir, entry.name);
          const newRelativePath = relativePath
            ? path.join(relativePath, entry.name)
            : entry.name;
          const subPackages = await scanForPackages(fullPath, newRelativePath);
          packages.push(...subPackages);
        }
      }),
    );

    if (relativePath && (await pathExists(path.join(dir, "package.json")))) {
      const packageInfo = await parsePackageJson(dir);
      if (packageInfo) {
        packages.push({
          name: packageInfo.name,
          path: relativePath,
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
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
