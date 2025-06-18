#!/usr/bin/env -S npx tsx

// NOTE: tsxを使わずにビルドしてdistに配置する場合は以下を指定
// #!/usr/bin/env node

import * as process from "node:process";
import { Command } from "commander";
import { makeAnalyzeCommand, makeDbCommand } from "./commands";

const program = new Command();
program.addCommand(makeAnalyzeCommand());
program.addCommand(makeDbCommand());

try {
  await program.parseAsync();
  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}
