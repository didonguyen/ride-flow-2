import { test, expect } from "@playwright/test";

test.describe("Public landing page (US-RF-015)", () => {
  test("anonymous visitor sees the new forest hero, top destinations, and CTAs", async ({
    page
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Explore Your.*Favorite Journey/
      })
    ).toBeVisible();

    await expect(page.getByText("Let's Make Our Life Better")).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Top destinations right now"
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Everything your group needs, in one workspace."
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Ready to plan your next trip?"
      })
    ).toBeVisible();
  });

  test("hero CTA pill is present and animates in", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByTestId("landing-hero-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/sign-up?next=/trips");

    const animationName = await cta.evaluate(
      (el) => getComputedStyle(el).animationName
    );
    expect(animationName).toContain("rideflow-hero-rise");
  });

  test("hero CTA navigates to sign-up with the next param", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("landing-hero-cta").click();

    await expect(page).toHaveURL(/\/sign-up\?next=%2Ftrips$/);
  });

  test("final CTA also navigates to sign-up with the next param", async ({
    page
  }) => {
    await page.goto("/");

    await page.getByTestId("landing-final-cta").click();

    await expect(page).toHaveURL(/\/sign-up\?next=%2Ftrips$/);
  });

  test("header Sign in link navigates to /sign-in with the next param", async ({
    page
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByRole("link", { name: "Sign in" })
      .click();

    await expect(page).toHaveURL(/\/sign-in\?next=%2Ftrips$/);
  });

  test("hero copy remains readable on 360px width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const heading = page.getByRole("heading", {
      level: 1,
      name: /Explore Your.*Favorite Journey/
    });
    await expect(heading).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
