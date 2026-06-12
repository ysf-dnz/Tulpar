import { test, expect } from "@playwright/test";

test("WhatsApp FAB has correct link and Ref code", async ({ page }) => {
  await page.goto("/");
  const fab = page.getByRole("link", { name: "WhatsApp ile konuşma başlat" });
  await expect(fab).toBeVisible();
  const href = await fab.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  const text = new URL(href!).searchParams.get("text");
  expect(decodeURIComponent(text ?? "")).toContain("Ref: FAB");
});

test("FAB tooltip appears on first visit and has close button", async ({ page }) => {
  await page.goto("/");
  const tooltip = page.getByRole("status").filter({ hasText: "24 saatte yanıt" });
  await expect(tooltip).toBeVisible({ timeout: 7000 });
  const close = tooltip.getByRole("button", { name: "Kapat" });
  await expect(close).toBeVisible();
  await close.click();
  await expect(tooltip).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("wa-tooltip-seen"))).toBe("1");
});
