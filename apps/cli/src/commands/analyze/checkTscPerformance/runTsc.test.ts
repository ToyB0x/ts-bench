import { describe, expect, it } from "vitest";
import { runTscOne, runTscMulti } from "./runTsc";

describe("runTsc exports", () => {
  it("should export runTscOne correctly", async () => {
    const pkg = { name: "@repo/cli", path: "apps/cli" };
    const result = await runTscOne(pkg);
    expect(result).toBeDefined();
  });

  it("should export runTscMulti correctly", async () => {
    const packages: Array<{ name: string; path: string }> = [];
    const results = await runTscMulti(packages);
    expect(results).toBeDefined();
  });
});