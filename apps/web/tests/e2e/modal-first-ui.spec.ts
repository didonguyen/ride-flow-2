import { test, expect } from "@playwright/test";

test.describe("Modal-First UI/UX (US-RF-016)", () => {
  test("landing Sign in opens a sign-in modal without leaving /", async ({
    page
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-in")
      .click();

    const dialog = page.getByTestId("auth-modal-sign-in");
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test("landing Get started opens a sign-up modal without leaving /", async ({
    page
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-up")
      .click();

    const dialog = page.getByTestId("auth-modal-sign-up");
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test("auth modal switches between sign-in and sign-up without navigation", async ({
    page
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-in")
      .click();

    await expect(page.getByTestId("auth-modal-sign-in")).toBeVisible();
    await page.getByTestId("auth-panel-switch-sign-in").click();
    await expect(page.getByTestId("auth-modal-sign-up")).toBeVisible();
    await page.getByTestId("auth-panel-switch-sign-up").click();
    await expect(page.getByTestId("auth-modal-sign-in")).toBeVisible();

    await expect(page).toHaveURL(/\/$/);
  });

  test("Esc closes the auth modal and returns focus to the trigger", async ({
    page
  }) => {
    await page.goto("/");

    const trigger = page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-in");
    await trigger.click();

    const dialog = page.getByTestId("auth-modal-sign-in");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await expect(trigger).toBeFocused();
  });

  test("fallback /sign-in renders the shared auth panel", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByTestId("auth-fallback-sign-in")).toBeVisible();
    await expect(page.getByTestId("auth-panel-sign-in")).toBeVisible();
    await expect(page.getByLabelText("Email")).toBeVisible();
    await expect(page.getByLabelText("Password")).toBeVisible();
  });

  test("fallback /sign-up renders the shared auth panel", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByTestId("auth-fallback-sign-up")).toBeVisible();
    await expect(page.getByTestId("auth-panel-sign-up")).toBeVisible();
    await expect(page.getByLabelText("Email")).toBeVisible();
    await expect(page.getByLabelText("Password")).toBeVisible();
  });

  test("fallback /sign-in surfaces a server error in the shared panel", async ({
    page
  }) => {
    await page.goto("/sign-in?error=Invalid%20email%20or%20password");

    await expect(page.getByTestId("auth-panel-sign-in")).toBeVisible();
    await expect(page.getByTestId("auth-panel-error")).toHaveText(
      "Invalid email or password"
    );
  });

  test("mobile 360px landing auth modal does not overflow horizontally", async ({
    page
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Landing actions" })
      .getByTestId("open-auth-modal-sign-in")
      .click();

    await expect(page.getByTestId("auth-modal-sign-in")).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Modal-First Create Trip (US-RF-016)", () => {
  test("fallback /trips/new renders the shared create-trip panel", async ({
    page
  }) => {
    await page.goto("/trips/new?error=invalid_date_range");

    await expect(page.getByTestId("create-trip-fallback")).toBeVisible();
    await expect(page.getByTestId("create-trip-panel")).toBeVisible();
    await expect(page.getByTestId("create-trip-panel-error")).toHaveText(
      "invalid_date_range"
    );
  });
});
