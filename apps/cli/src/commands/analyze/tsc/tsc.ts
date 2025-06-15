import { listPackages } from "../libs";

export const tsc = async () => {
  console.log("Running tsc performance check...");

  // Step 1: list packages in the git repository
  const packages = await listPackages();
  console.log(`Found ${packages.length} packages.`);
  console.log("Packages:", packages);

  // Step 2: run tsc for each package, and store result to sqlite (with multicore support)
  // Step 3: analyze the result and output to stdout
};
