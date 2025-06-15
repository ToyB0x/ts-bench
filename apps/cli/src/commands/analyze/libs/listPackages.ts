import * as fs from "node:fs/promises";
import * as path from "node:path";

const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".git", "generated"]);

type Package = {
  name: string;
  path: string;
};

/**
 * List packages in the current git repository.
 * Scans the repository for directories containing a package.json file,
 * excluding common build/dependency directories.
 */
export const listPackages = async (): Promise<Package[]> => {
  const gitRoot = await findGitRoot();
  if (!gitRoot) {
    throw new Error("Not in a git repository");
  }
  return await scanForPackages(gitRoot);
};

async function findGitRoot(): Promise<string | null> {
  let currentDir = process.cwd();

  while (currentDir !== path.dirname(currentDir)) {
    if (await directoryExists(path.join(currentDir, ".git"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // Check root directory
  if (await directoryExists(path.join(currentDir, ".git"))) {
    return currentDir;
  }

  return null;
}

async function scanForPackages(
  dir: string,
  relativePath = "",
  packages: Package[] = [],
): Promise<Package[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name)) {
          const fullPath = path.join(dir, entry.name);
          const newRelativePath = relativePath
            ? path.join(relativePath, entry.name)
            : entry.name;
          await scanForPackages(fullPath, newRelativePath, packages);
        } else if (entry.name === "package.json" && relativePath) {
          const packageInfo = await parsePackageJson(
            path.join(dir, "package.json"),
          );
          if (packageInfo) {
            packages.push({
              name: packageInfo.name,
              path: relativePath,
            });
          }
        }
      }),
    );
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }

  return packages;
}

async function parsePackageJson(
  packageJsonPath: string,
): Promise<{ name: string } | null> {
  try {
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const packageData = JSON.parse(content);
    return packageData.name ? { name: packageData.name } : null;
  } catch (error) {
    console.error(`Error parsing package.json at ${packageJsonPath}:`, error);
    return null;
  }
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath);
    return true;
  } catch {
    return false;
  }
}
