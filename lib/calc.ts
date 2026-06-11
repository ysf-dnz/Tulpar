export function fiveYearCost(i: { rivalPrice: number; tulparPrice: number; washesPerYear: number; washPrice: number }) {
  const rivalTotal = i.rivalPrice + 5 * i.washesPerYear * i.washPrice;
  const tulparTotal = i.tulparPrice;
  return { rivalTotal, tulparTotal, savings: rivalTotal - tulparTotal };
}
