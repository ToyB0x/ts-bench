import { cpus } from "node:os";
import { PromisePool } from "@supercharge/promise-pool";
import {
  listPackages,
  saveResultsToDatabase,
  showTable,
  tscAndAnalyze,
} from "./libs";

export const runBench = async (): Promise<void> => {
  // Step 1: List packages in the git repository
  const packages = await listPackages();

  // Step 2: Run tsc for each package with multicore support (Use 80% of available CPUs for accuracy)
  const totalCPUs = cpus().length;
  const cpuModelAndSpeeds = [
    ...new Set(
      cpus().map((cpu) =>
        cpu.speed ? `${cpu.model} (${cpu.speed}MHz)` : `${cpu.model}`,
      ),
    ),
  ];

  const NUM_RESERVE_CPUS = 0; // Reserve some CPUs for the system to ensure accuracy
  const maxConcurrency = totalCPUs - NUM_RESERVE_CPUS;
  console.log(
    `**Tsc benchmark: Using ${maxConcurrency} / ${totalCPUs} CPUs (${NUM_RESERVE_CPUS ? `reserving ${NUM_RESERVE_CPUS} CPU for accuracy` : "Full-Throttle!"})**
CPU: ${cpuModelAndSpeeds.join(", ")}`,
  );

  // Step 3: Run tsc for each package with multicore support
  const { results } = await PromisePool.withConcurrency(maxConcurrency)
    .for(packages)
    .process((pkg) => tscAndAnalyze(pkg));

  // Step 4: Write result to sqlite (with multicore support)
  await saveResultsToDatabase(results, cpuModelAndSpeeds).catch(console.error);

  // Step 5: Show results
  await showTable(results);
};
