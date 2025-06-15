import { describe, expect, it } from "vitest";
import { runTscMulti } from "./runTscMulti";

describe("runTscMulti", () => {
  it("should return empty array when no packages provided", async () => {
    const packages: Array<{ name: string; path: string }> = [];
    const results = await runTscMulti(packages);
    expect(results).toEqual([]);
  });

  it("should return correct structure for multiple packages", async () => {
    const packages = [
      { name: "@repo/cli", path: "apps/cli" },
      { name: "@repo/db", path: "packages/database" },
    ];

    const results = await runTscMulti(packages);

    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      packageName: "@repo/cli",
      packagePath: "apps/cli",
      success: expect.any(Boolean),
      errors: expect.any(Number),
      output: expect.any(String),
      duration: expect.any(Number),
    });
    expect(results[1]).toMatchObject({
      packageName: "@repo/db",
      packagePath: "packages/database",
      success: expect.any(Boolean),
      errors: expect.any(Number),
      output: expect.any(String),
      duration: expect.any(Number),
    });
  });
});