export interface TscResult {
  packageName: string;
  packagePath: string;
  success: boolean;
  errors: number;
  output: string;
  duration: number;
}

export interface Package {
  name: string;
  path: string;
}

export const runTscOne = async (pkg: Package): Promise<TscResult> => {
  return {
    packageName: pkg.name,
    packagePath: pkg.path,
    success: true,
    errors: 0,
    output: "Mock output",
    duration: 100,
  };
};