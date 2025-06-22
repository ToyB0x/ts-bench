export const runPreprpareCommands = async (
  commands: string[],
  workingDir: string,
): Promise<void> => {
  for (const command of commands) {
    console.info(`Running setup command: ${command}`);

    // run setup commands via bash (eg., pnpm install, pnpm build)
    const { exec } = await import("node:child_process");
    await new Promise<void>((resolve, reject) => {
      exec(
        command,
        {
          cwd: workingDir,
        },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${command}`, error, stderr);
            reject(error);
          } else {
            console.info(`Command output: ${stdout}`);
            resolve();
          }
        },
      );
    });
  }
};
