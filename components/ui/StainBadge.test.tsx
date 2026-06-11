import { expect, test } from "vitest";
import { stainScore } from "./StainBadge";

test("4 PASS = 4", () => {
  const l = { tea: { result: "PASS" }, coffee: { result: "PASS" }, cherry: { result: "PASS" }, ink: { result: "PASS" } };
  expect(stainScore(l)).toBe(4);
});
test("PARTIAL/FAIL sayılmaz, undefined = 0", () => {
  expect(stainScore({ tea: { result: "PARTIAL" }, ink: { result: "FAIL" } })).toBe(0);
  expect(stainScore(undefined)).toBe(0);
});
