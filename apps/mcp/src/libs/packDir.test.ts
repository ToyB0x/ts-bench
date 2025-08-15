import { expect, test } from "vitest";
import { packDir } from "./packDir";

test("packDir", async () => {
  const result = await packDir(".");
  expect(typeof result).toBe("string");
});
