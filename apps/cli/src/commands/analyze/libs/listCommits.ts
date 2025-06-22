import { simpleGit } from "simple-git";

export const listCommits = async () => {
  const logs = await simpleGit().log();
  return logs.all;
};
