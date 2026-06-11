import { expect, test } from "vitest";
import { fiveYearCost } from "@/lib/calc";

test("5 yıllık maliyet: fiyat + yıl×yıkama×bedel", () => {
  // rakip: 5000₺ halı, yılda 2 yıkama × 900₺ → 5000 + 5*2*900 = 14000
  // tulpar: 8000₺ halı, evde yıkanabilir → 8000
  const r = fiveYearCost({ rivalPrice: 5000, tulparPrice: 8000, washesPerYear: 2, washPrice: 900 });
  expect(r).toEqual({ rivalTotal: 14000, tulparTotal: 8000, savings: 6000 });
});
