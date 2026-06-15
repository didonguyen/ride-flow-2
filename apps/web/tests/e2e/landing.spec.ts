import { test, expect } from "@playwright/test";

test.describe("Public landing page (US-RF-014)", () => {
  test("anonymous visitor sees the hero, features, and CTAs", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Plan trips together, day by day." })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "Everything your group needs, in one workspace." })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "How RideFlow works." })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "See the dashboard before you sign up." })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "Ready to plan your next trip?" })
    ).toBeVisible();

    await expect(
      page.getByRole("img", { name: "RideFlow dashboard preview showing three trip cards and a new-trip card." })
    ).toBeVisible();
  });

  test("hero CTA navigates to sign-up with the next param", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("landing-hero-cta").click();

    await expect(page).toHaveURL(/\/sign-up\?next=%2Ftrips$/);
  });

  test("final CTA also navigates to sign-up with the next param", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("landing-final-cta").click();

    await expect(page).toHaveURL(/\/sign-up\?next=%2Ftrips$/);
  });

  test("header Sign in link navigates to /sign-in with the next param", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("navigation", { name: "Landing actions" }).getByRole("link", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/sign-in\?next=%2Ftrips$/);
  });

  test("hero copy remains readable on 360px width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const heading = page.getByRole("heading", {
      level: 1,
      name: "Plan trips together, day by day."
    });
    await expect(heading).toBeVisible();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
