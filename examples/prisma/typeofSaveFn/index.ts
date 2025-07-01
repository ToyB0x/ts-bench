import { PrismaClient } from "@ts-bench/prisma-base";

// typeof technique
type Arg = typeof client;
const saveFn = async (_prismaClient: Arg) => {}; // Some insert processing

const client = new PrismaClient({ datasourceUrl: "file:./sample.db" });
await saveFn(client); // Saving data after some business logic

// This example, tsc --noEmit --diagnostics will output like this:
// Types:              222
// Instantiations:     152
// Memory used:    146854K
// Total time:       0.41s
