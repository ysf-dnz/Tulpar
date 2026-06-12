import { test, expect } from "@playwright/test";

test("cost calculator computes Fark and builds WhatsApp share link", async ({ page }) => {
  await page.goto("/maliyet-hesaplayici/");

  const inputs = page.locator('input[type="number"]');
  await expect(inputs).toHaveCount(4);
  const values = [5000, 8000, 2, 900];
  for (let i = 0; i < values.length; i++) {
    await inputs.nth(i).fill(String(values[i]));
  }

  // rival: 5000 + 5*2*900 = 14000; tulpar: 8000; fark: 6000
  // CMS metinlerinde de "fark" geçebildiği için sonuç satırına (altın renkli özet) sabitle.
  const farkRow = page.locator("p.text-gold", { hasText: "Fark" });
  await expect(farkRow).toContainText("6.000 ₺");

  const share = page.getByRole("link", { name: /WhatsApp'ta paylaş/ });
  const href = await share.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\//);
  const text = new URL(href!).searchParams.get("text");
  expect(decodeURIComponent(text ?? "")).toContain("6.000");
});
