import { describe, expect, it } from "vitest";
import { listPackages } from "./listPackages";

describe("listPackages", () => {
  it("should return this monorepo packages", async () => {
    const packages = await listPackages();
    const cwd = process.cwd();
    const rootDir = cwd.split("/").slice(0, -2).join("/");

    // check exact match of package names and paths (assert contain all packages, and not contain extra package)
    expect(packages.sort((a, b) => a.name.localeCompare(b.name))).toEqual([
      {
        absolutePath: cwd,
        name: "@ts-bench/cli",
        relativePathFromRoot: "apps/cli",
      },
      {
        absolutePath: `${rootDir}/packages/db`,
        name: "@ts-bench/db",
        relativePathFromRoot: "packages/db",
      },
      {
        absolutePath: `${rootDir}/apps/web`,
        name: "@ts-bench/web",
        relativePathFromRoot: "apps/web",
      },
      {
        absolutePath: `${rootDir}/apps/ts-bench`,
        name: "ts-bench",
        relativePathFromRoot: "apps/ts-bench",
      },
    ]);
  });
});
