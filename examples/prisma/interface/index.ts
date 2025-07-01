import { PrismaClient } from "@ts-bench/prisma-base";

// Interface technique: minimal PrismaClient interface
interface IPrismaTreeClient {
  tree1: PrismaClient["tree1"];
}

const extendPrisma = <T extends IPrismaTreeClient>(PrismaClient: T): T => {
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
// Types:             3004
// Instantiations:   19098
// Total time:       0.45s
