import type { TscResult } from "./types";

export const analyzeResults = (results: TscResult[]): void => {
  console.table(
      results.map((result) => ({
        ...result,
        package: result.package.name,
      })),
  );
};
