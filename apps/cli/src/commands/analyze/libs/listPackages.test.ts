import { describe, expect, it } from "vitest";
import { listPackages } from "./listPackages";

describe("listPackages", () => {
  it("should return this monorepo packages", async () => {
    const packages = await listPackages();
    expect(packages).toContain([
      {
        name: "@repo/cli",
        path: "apps/cli",
      },
      {
        name: "@repo/db",
        path: "packages/db",
      },
    ]);
  });
});
