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
export const listPackages = async (): Promise<Package> => {};
