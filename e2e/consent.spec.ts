import { test, expect, type Page } from "@playwright/test";

const banner = (page: Page) => page.getByRole("dialog", { name: "Çerez tercihi" });

const trackerScripts = (page: Page) =>
  page.locator(
    'script[src*="googletagmanager.com"], script[src*="connect.facebook.net"], script#ga4, script#meta-pixel'
  );

test("banner visible on first visit, no tracker scripts before decision", async ({ page }) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  await expect(trackerScripts(page)).toHaveCount(0);
});

test("Reddet hides banner, persists denial, no trackers", async ({ page }) => {
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Reddet" }).click();
  await expect(banner(page)).toBeHidden();
  await expect(trackerScripts(page)).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("consent"))).toBe("denied");

  await page.reload();
  await expect(banner(page)).toBeHidden();
  await expect(trackerScripts(page)).toHaveCount(0);
});

test("Kabul et hides banner and persists grant", async ({ page }) => {
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Kabul et" }).click();
  await expect(banner(page)).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("consent"))).toBe("granted");

  await page.reload();
  await expect(banner(page)).toBeHidden();
});
