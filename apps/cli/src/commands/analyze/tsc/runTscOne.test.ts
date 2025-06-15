import { describe, expect, it } from "vitest";
import { runTscOne } from "./runTscOne";

describe("runTscOne", () => {
  it("should return correct structure for single package", async () => {
    const pkg = { name: "@repo/cli", path: "apps/cli" };
    const result = await runTscOne(pkg);

    expect(result).toMatchObject({
      packageName: "@repo/cli",
      packagePath: "apps/cli",
      success: expect.any(Boolean),
      errors: expect.any(Number),
      output: expect.any(String),
      duration: expect.any(Number),
    });
  });
});