import { cpus } from "node:os";
import { PromisePool } from "@supercharge/promise-pool";
import {
  generateReportMarkdown,
  listPackages,
  type REPORT_LANGUAGE_CODE_MAP,
  saveResultsToDatabase,
  tscAndAnalyze,
} from "./libs";

type RunBenchOptions = {
  enableShowTable: boolean;
  reportLanguageCode?: keyof typeof REPORT_LANGUAGE_CODE_MAP;
  cachedPackages?: string[];
};

export const runBench = async ({
  enableShowTable = true,
  cachedPackages = [],
  reportLanguageCode = "en",
}: RunBenchOptions): Promise<void> => {
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

  const headerString = `Tsc benchmark: Using ${maxConcurrency} / ${totalCPUs} CPUs (CPU: ${cpuModelAndSpeeds.join(", ")})`;
  console.log(headerString);

  // Step 3: Run tsc for each package with multicore support
  const { results } = await PromisePool.withConcurrency(maxConcurrency)
    .for(packages)
    .process((pkg) => tscAndAnalyze(pkg, cachedPackages));

  // Step 4: Write result to sqlite (with multicore support)
  await saveResultsToDatabase(results, cpuModelAndSpeeds).catch(console.error);

  // Step 5: Show results
  if (enableShowTable) {
    const enabledAiAnalytics = true;
    await generateReportMarkdown(
      cpuModelAndSpeeds,
      maxConcurrency,
      totalCPUs,
      enabledAiAnalytics,
      reportLanguageCode,
    );
  }
};
