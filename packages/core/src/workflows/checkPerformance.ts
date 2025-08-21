import { stepTsc } from "../steps";

export const workflowCheckPerformance = async () => {
  // console.error("finding tsc files...");
  // console.error("reading tsc files...");

  // TODO:shouwConfigオプションをしたあとでdebugオプションで実行？
  await stepTsc({
    // TODO: add generate config step (dont pass config directly)
    packageManager: "pnpm",
    cwd: ".",
  }).match(
    (value) => console.info(value),
    (error) => console.error("Error in stepTsc:", error),
  );

  // console.error("reading tsc results...");
  // console.error("saving tsc results...");
};
