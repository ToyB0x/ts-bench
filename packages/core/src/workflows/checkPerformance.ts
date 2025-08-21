import { stepTsc } from "../steps";

export const workflowCheckPerformance = async () => {
  // console.error("finding tsc files...");
  // console.error("reading tsc files...");

  // TODO:shouwConfigオプションをしたあとでdebugオプションで実行？
  await stepTsc({
    // TODO: add generate config step (dont pass config directly)
    packageManager: "pnpm",
    cwd: ".",
    tscOptions: "--extendedDiagnostics",
  }).match(
    (v) => console.info(v),
    (e) => console.error(`Error type: ${e.type}`, e.error),
  );

  // console.error("reading tsc results...");
  // console.error("saving tsc results...");
};
