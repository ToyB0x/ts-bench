import { workflowTsc } from "./src/workflows";

const main = async () => {
  console.info("Running test-run...");
  await workflowTsc();
};

main();
