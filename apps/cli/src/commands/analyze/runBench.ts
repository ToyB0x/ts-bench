import * as os from "node:os";
import { PromisePool } from "@supercharge/promise-pool";
import { listPackages, showTable, tscAndAnalyze } from "./libs";

export const runBench = async (): Promise<void> => {
  // Step 1: List packages in the git repository
  const packages = await listPackages();

  // Step 2: Run tsc for each package with multicore support (Use 80% of available CPUs for accuracy)
  const totalCPUs = os.cpus().length;
  const maxConcurrency = Math.max(1, Math.floor(totalCPUs * 0.8));
  console.log(
    `----- Available CPUs: ${totalCPUs}, Using: ${maxConcurrency} (80%) -----`,
  );

  // Step 3: Run tsc for each package with multicore support
  const { results } = await PromisePool.withConcurrency(maxConcurrency)
    .for(packages)
    .process((pkg) => tscAndAnalyze(pkg));

  // Step 4: Analyze the results and output to stdout
  showTable(results);

  // Step 5: Write result to sqlite (with multicore support)
  // TODO: Implement database storage
};
