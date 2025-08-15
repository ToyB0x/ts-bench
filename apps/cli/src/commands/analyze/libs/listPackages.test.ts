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
        absolutePath: `${rootDir}/apps/cli`,
        name: "@ts-bench/cli",
        relativePathFromRoot: "apps/cli",
      },
      {
        absolutePath: `${rootDir}/packages/db`,
        name: "@ts-bench/db",
        relativePathFromRoot: "packages/db",
      },
      {
        absolutePath: `${rootDir}/apps/mcp`,
        name: "@ts-bench/mcp",
        relativePathFromRoot: "apps/mcp",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/base`,
        name: "@ts-bench/prisma-base",
        relativePathFromRoot: "examples/prisma/base",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/heavy`,
        name: "@ts-bench/prisma-heavy",
        relativePathFromRoot: "examples/prisma/heavy",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/heavySaveFn`,
        name: "@ts-bench/prisma-heavy-save-fn",
        relativePathFromRoot: "examples/prisma/heavySaveFn",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/interface`,
        name: "@ts-bench/prisma-interface",
        relativePathFromRoot: "examples/prisma/interface",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/simple`,
        name: "@ts-bench/prisma-simple",
        relativePathFromRoot: "examples/prisma/simple",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/typeof`,
        name: "@ts-bench/prisma-typeof",
        relativePathFromRoot: "examples/prisma/typeof",
      },
      {
        absolutePath: `${rootDir}/examples/prisma/typeofSaveFn`,
        name: "@ts-bench/prisma-typeof-save-fn",
        relativePathFromRoot: "examples/prisma/typeofSaveFn",
      },
      {
        absolutePath: `${rootDir}/packages/utils`,
        name: "@ts-bench/utils",
        relativePathFromRoot: "packages/utils",
      },
      {
        absolutePath: `${rootDir}/apps/web`,
        name: "@ts-bench/web",
        relativePathFromRoot: "apps/web",
      },
    ]);
  });
});
