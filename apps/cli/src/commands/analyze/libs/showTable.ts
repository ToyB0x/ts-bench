import type { TscResult } from "../runTscBench/types";

export const showTable = (results: TscResult[]): void => {
  console.table(
      results.map((result) => ({
        ...result,
        package: result.package.name,
      })),
  );
};
