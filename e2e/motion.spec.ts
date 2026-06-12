import { test, expect } from "@playwright/test";

// FLW-09: with prefers-reduced-motion, the site stays fully functional (no content loss).
test("home is functional under reduced motion", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("header").first()).toBeVisible();

  // KilimProgress bar: under reduced motion the scroll listener is skipped,
  // so the inner bar stays at scaleX(0) (or is absent entirely).
  const bar = page.locator("div.origin-left.scale-x-0");
  if ((await bar.count()) > 0) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(300);
    const transform = await bar.first().evaluate((el) => el.style.transform);
    expect(transform).toBe("");
  }

  // Content still reachable: FAB present under reduced motion too.
  await expect(page.getByRole("link", { name: "WhatsApp ile konuşma başlat" })).toBeVisible();
});
