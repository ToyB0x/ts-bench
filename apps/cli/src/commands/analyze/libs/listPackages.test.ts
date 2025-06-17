import { describe, expect, it } from "vitest";
import { listPackages } from "./listPackages";

describe("listPackages", () => {
  it("should return this monorepo packages", async () => {
    const packages = await listPackages();

    // check exact match of package names and paths (assert contain all packages, and not contain extra package)
    expect(packages.sort((a, b) => a.name.localeCompare(b.name))).toEqual([
      {
        name: "@ts-bench/cli",
        path: "apps/cli",
      },
      {
        name: "@ts-bench/db",
        path: "packages/database",
      },
    ]);
  });
});
