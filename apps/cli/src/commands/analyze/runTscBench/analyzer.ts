import type { TscResult } from "./types";

export const analyzeResults = (results: TscResult[]): void => {
  const successCount = results.filter((r) => r.status === "SUCCESS").length;
  const failureCount = results.length - successCount;
  const totalTime = results.reduce((sum, r) => sum + r.durationMs, 0);
  const avgTime = totalTime / results.length;

  console.log("\n--- Analysis ---");
  console.log(`Packages processed: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per package: ${avgTime.toFixed(2)}ms`);
};
