import { PrismaClient } from "@ts-bench/prisma-base";

// typeof technique
const extendPrisma = (PrismaClient: typeof client) => {
  console.log("Extend PrismaClient with some logger and other features...");
  return PrismaClient;
};

const client = new PrismaClient({ datasourceUrl: "file:./sample.db" });
const result = await client.tree1.findMany();
console.log(result);

const extendedClient = extendPrisma(client);
const extendedResult = await extendedClient.tree1.findMany();
console.log(extendedResult);

// This example, tsc --noEmit --diagnostics will output like this:
// Types:              648
// Instantiations:     972
// Total time:       0.43s
