export type CommandTsc = string; // ひとまず"tsc --a --b" などの任意の文字列コマンドを受け付ける
export type StepTsc = (cmd: CommandTsc) => Promise<string>; // ひとまずはコマンド実行結果をStringで返す

export const stepTsc: StepTsc = async (cmd) => {
  console.info(cmd);
  return `tsc result: ${cmd}`; // ひとまずはコマンド実行結果をStringで返す
};
