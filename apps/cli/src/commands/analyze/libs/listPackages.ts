import * as fs from "node:fs/promises";
import * as path from "node:path";

const excludedDirs = new Set(["node_modules", "dist", ".git", "generated"]);

type Package = {
  name: string;
  path: string;
};

/**
 * List packages in the current git repository.
 * This function scans the repository for directories containing a package.json file,
 * excluding those in node_modules and other common directories.
 *
 * For each package found, it returns an object containing the package name and path.
 * This function is useful for analyzing or processing multiple packages in a monorepo setup.
 */
export const listPackages = async (): Promise<Package[]> => {
  const gitRootDir = await findGitRoot();
  if (!gitRootDir) {
    throw new Error("No git root directory found.");
  }
  return await findPackageJson(gitRootDir);
};

// Find git root directory
const findGitRoot = async (): Promise<string | null> => {
  let currentDir = process.cwd();
  while (currentDir !== path.dirname(currentDir)) {
    try {
      await fs.access(path.join(currentDir, ".git"));
      return currentDir;
    } catch {
      currentDir = path.dirname(currentDir);
    }
  }

  // Return null if no .git directory is found
  try {
    await fs.access(path.join(currentDir, ".git"));
    return currentDir;
  } catch {
    return null;
  }
};

// Recursively search for package.json files in the directory tree
const findPackageJson = async (
  dir: string,
  relativePath = "",
  packages: Package[] = [],
) => {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && !excludedDirs.has(item.name)) {
        const fullPath = path.join(dir, item.name);
        const newRelativePath = relativePath
          ? path.join(relativePath, item.name)
          : item.name;
        await findPackageJson(fullPath, newRelativePath, packages);
      } else if (item.name === "package.json" && relativePath) {
        try {
          const packageJsonPath = path.join(dir, "package.json");
          const content = await fs.readFile(packageJsonPath, "utf-8");
          const packageData = JSON.parse(content);

          if (packageData.name) {
            packages.push({
              name: packageData.name,
              path: relativePath,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return packages;
};
