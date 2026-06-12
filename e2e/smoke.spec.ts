import { test, expect } from "@playwright/test";

test("home loads without server error", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("header").first()).toBeVisible();
});

for (const path of ["/halilar/", "/acik-pano/", "/sss/", "/iletisim/"]) {
  test(`${path} responds 200`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
  });
}

test("trailing slash redirect: /halilar -> /halilar/ with 308", async ({ request }) => {
  const res = await request.get("/halilar", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toContain("/halilar/");
});

test("404 page shows branded Turkish copy", async ({ page }) => {
  const res = await page.goto("/olmayan-sayfa/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Koleksiyona dön" })).toBeVisible();
});
