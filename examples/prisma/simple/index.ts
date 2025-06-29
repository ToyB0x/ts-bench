import { PrismaClient } from "@ts-bench/prisma-base";

const client = new PrismaClient({ datasourceUrl: "file:./sample.db" });
const result = await client.tree1.findMany();
console.log(result);

// This example, tsc --noEmit --diagnostics will output like this:
// Types:              644
// Instantiations:     972
// Total time:       0.41s
