import { describe, expect, it } from "vitest";
import { runTsc } from "./runTsc";

describe("runTsc", () => {
  it("should return empty array when no packages provided", async () => {
    const packages: Array<{ name: string; path: string }> = [];
    const results = await runTsc(packages);
    expect(results).toEqual([]);
  });

  it("should return correct structure for packages", async () => {
    const packages = [
      { name: "@repo/cli", path: "apps/cli" },
    ];

    const results = await runTsc(packages);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      packageName: "@repo/cli",
      packagePath: "apps/cli",
      success: expect.any(Boolean),
      errors: expect.any(Number),
      output: expect.any(String),
      duration: expect.any(Number),
    });
  });
});