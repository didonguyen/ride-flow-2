import { test, expect } from "@playwright/test";

test.describe("Editorial landing page (US-RF-018)", () => {
  test("anonymous visitor sees the Vietnam hero, discover section, and CTAs", async ({
    page
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Vietnam" })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Discover\s+Vietnam/
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "The Modern Explorer toolkit"
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Plan your next journey"
      })
    ).toBeVisible();

    await expect(
      page.getByTestId("landing-region-hanoi")
    ).toBeVisible();
    await expect(
      page.getByTestId("landing-region-hcmc")
    ).toBeVisible();
    await expect(
      page.getByTestId("landing-region-card-hoàng-sa")
    ).toBeVisible();
    await expect(
      page.getByTestId("landing-region-card-trường-sa")
    ).toBeVisible();
  });

  test("header Sign in opens the sign-in modal on /", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-in")
      .click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("auth-modal-sign-in")).toBeVisible();
  });

  test("hero CTA opens the sign-up modal without route navigation", async ({
    page
  }) => {
    await page.goto("/");

    await page.getByTestId("landing-hero-cta").click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("auth-modal-sign-up")).toBeVisible();
  });

  test("final CTA opens the sign-up modal without route navigation", async ({
    page
  }) => {
    await page.goto("/");

    await page.getByTestId("landing-final-cta").click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("auth-modal-sign-up")).toBeVisible();
  });

  test("hero copy remains readable on 360px width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1, name: "Vietnam" });
    await expect(heading).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
