import { workflowCheckPerformance } from "./src/workflows";

const main = async () => {
  console.info("Running test-run...");
  await workflowCheckPerformance();
};

main();
