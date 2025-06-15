import { describe, expect, it } from "vitest";
import { listPackages } from "./listPackages";

describe("listPackages", () => {
  it("should return this monorepo packages", async () => {
    const packages = await listPackages();
    expect(packages).toContainEqual({
      name: "@repo/cli",
      path: "apps/cli",
    });
    expect(packages).toContainEqual({
      name: "@repo/db",
      path: "packages/database",
    });
  });
});
