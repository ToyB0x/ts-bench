import { PrismaClient } from "@ts-bench/prisma-base";

// simple PrismaClient type
type Arg = PrismaClient;
const saveFn = async (_prismaClient: Arg) => {}; // Some insert processing

const client = new PrismaClient({ datasourceUrl: "file:./sample.db" });
await saveFn(client); // Saving data after some business logic

// This example, tsc --noEmit --diagnostics will output like this:
// Types:           269598
// Instantiations: 2772929
// Memory used:    394718K
// Total time:       1.86s
