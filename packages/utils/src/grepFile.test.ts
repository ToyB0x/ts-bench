import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { grepFile } from "./grepFile.js";

describe("grepFile", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "grepFile-test-"));

    // Create test files
    await fs.writeFile(
      path.join(testDir, "file1.txt"),
      "Hello world\nThis is a test\nAnother line with test",
    );

    await fs.writeFile(
      path.join(testDir, "file2.js"),
      "const test = 'value';\nconsole.log('Hello');\nfunction testFunction() {}",
    );

    // Create subdirectory with files
    const subDir = path.join(testDir, "subdir");
    await fs.mkdir(subDir);

    await fs.writeFile(
      path.join(subDir, "nested.ts"),
      "interface TestInterface {}\nexport const test = 123;\n// test comment",
    );
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it("should find matches in all files recursively", async () => {
    const results = await grepFile(testDir, "test");

    expect(results).toHaveLength(3);
    expect(results.some((r) => r.filePath.endsWith("file1.txt"))).toBe(true);
    expect(results.some((r) => r.filePath.endsWith("file2.js"))).toBe(true);
    expect(results.some((r) => r.filePath.endsWith("nested.ts"))).toBe(true);
  });

  it("should filter by file extensions", async () => {
    const results = await grepFile(testDir, "test", [".js", ".ts"]);

    expect(results).toHaveLength(2);
    expect(
      results.every(
        (r) => r.filePath.endsWith(".js") || r.filePath.endsWith(".ts"),
      ),
    ).toBe(true);
  });

  it("should work with RegExp patterns", async () => {
    const results = await grepFile(testDir, /^const/);

    expect(results).toHaveLength(1);
    const matches = results.flatMap((r) => r.matches);
    expect(matches.some((m) => m.includes("const test = 'value';"))).toBe(true);
  });

  it("should return correct file paths and matches", async () => {
    const results = await grepFile(testDir, "Hello");

    expect(results).toHaveLength(2);

    const file1Result = results.find((r) => r.filePath.endsWith("file1.txt"));
    expect(file1Result?.matches).toEqual(["Hello world"]);

    const file2Result = results.find((r) => r.filePath.endsWith("file2.js"));
    expect(file2Result?.matches).toEqual(["console.log('Hello');"]);
  });

  it("should return empty array when no matches found", async () => {
    const results = await grepFile(testDir, "nonexistent");

    expect(results).toEqual([]);
  });

  it("should handle empty directory", async () => {
    const emptyDir = path.join(testDir, "empty");
    await fs.mkdir(emptyDir);

    const results = await grepFile(emptyDir, "test");

    expect(results).toEqual([]);
  });

  it("should search deeply nested directories (3 levels)", async () => {
    // Create deep directory structure: testDir/level1/level2/level3
    const level1 = path.join(testDir, "level1");
    const level2 = path.join(level1, "level2");
    const level3 = path.join(level2, "level3");

    await fs.mkdir(level1);
    await fs.mkdir(level2);
    await fs.mkdir(level3);

    // Add files at different levels
    await fs.writeFile(
      path.join(level1, "deep1.txt"),
      "deep test level 1\nsome content",
    );

    await fs.writeFile(
      path.join(level2, "deep2.txt"),
      "another line\ndeep test level 2",
    );

    await fs.writeFile(
      path.join(level3, "deep3.txt"),
      "deep test level 3\nfinal content\ndeep nested content",
    );

    const results = await grepFile(testDir, "deep test");

    // Should find files in all 3 nested levels plus original files
    expect(results.length).toBeGreaterThanOrEqual(3);

    const deepResults = results.filter((r) => r.filePath.includes("level"));
    expect(deepResults).toHaveLength(3);

    expect(
      deepResults.some((r) => r.filePath.includes("level1/deep1.txt")),
    ).toBe(true);
    expect(
      deepResults.some((r) => r.filePath.includes("level2/deep2.txt")),
    ).toBe(true);
    expect(
      deepResults.some((r) => r.filePath.includes("level3/deep3.txt")),
    ).toBe(true);
  });
});
