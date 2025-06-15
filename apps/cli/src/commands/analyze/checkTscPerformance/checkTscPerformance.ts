import * as os from "node:os";
import { PromisePool } from "@supercharge/promise-pool";
import { listPackages } from "../libs";
import { analyzeResults } from "./analyzer";
import { runTscForPackage } from "./tscRunner";

export const checkTscPerformance = async (): Promise<void> => {
  console.log("Running tsc performance check...");

  // Step 1: List packages in the git repository
  const packages = await listPackages();
  console.log(`Found ${packages.length} packages.`);
  console.log("Packages:", packages);

  // Step 2: Run tsc for each package with multicore support

  /*
  Use 80% of available CPUs for concurrency. (increase test accuracy)
  Examples:
  - 4 cores → uses 3 cores
  - 8 cores → uses 6 cores
  - 1 core → uses 1 core (minimum)
   */
  const totalCPUs = os.cpus().length;
  const maxConcurrency = Math.max(1, Math.floor(totalCPUs * 0.8));
  console.log(`Available CPUs: ${totalCPUs}, Using: ${maxConcurrency} (80%)`);

  const { results } = await PromisePool.withConcurrency(maxConcurrency)
    .for(packages)
    .process((pkg) => runTscForPackage(pkg));

  console.log("\n--- All tasks completed ---");
  console.table(
    results.map((result) => ({
      ...result,
      package: result.package.name,
    })),
  );

  // Step 3: Analyze the results and output to stdout
  analyzeResults(results);

  // Step 4: Write result to sqlite (with multicore support)
  // TODO: Implement database storage
};
