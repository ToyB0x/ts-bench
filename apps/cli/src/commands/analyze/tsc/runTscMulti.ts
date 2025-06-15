import { type Package, type TscResult, runTscOne } from "./runTscOne";

export const runTscMulti = async (
  packages: Package[],
): Promise<TscResult[]> => {
  if (packages.length === 0) {
    return [];
  }

  // Run tsc for all packages in parallel
  return await Promise.all(packages.map((pkg) => runTscOne(pkg)));
};
