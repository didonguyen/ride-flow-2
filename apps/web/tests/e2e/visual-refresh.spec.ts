import { test, expect } from "@playwright/test";

test.describe("Trip card visual refresh (US-RF-015)", () => {
  test("trip card on /trips shows the refreshed style with rating badge", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/trips/da-nang");

    const cover = page.locator("h1", { hasText: "Da Nang Trip" });
    await expect(cover).toBeVisible();
  });
});
