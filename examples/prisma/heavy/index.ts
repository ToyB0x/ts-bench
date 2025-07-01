import { PrismaClient } from "@ts-bench/prisma-base";

const extendPrisma = (PrismaClient: PrismaClient) => {
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
// Types:           269668
// Instantiations: 2773122
// Total time:       1.84s
