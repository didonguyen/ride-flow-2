import { test, expect } from "@playwright/test";

test.describe("Editorial dashboard (US-RF-018)", () => {
  test("anonymous visitor is redirected to /sign-in", async ({ page }) => {
    const response = await page.goto("/trips");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
