import { stepTsc } from "../steps";

export const workflowCheckPerformance = async () => {
  console.error("finding tsc files...");
  console.error("reading  tsc files...");
  console.info("running workflowTsc...");

  await stepTsc("sample command");

  console.error("executing tsc...");
  console.error("reading tsc results...");

  console.error("saving tsc results...");
};
