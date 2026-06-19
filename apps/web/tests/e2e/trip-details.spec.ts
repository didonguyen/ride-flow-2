import { test, expect } from "@playwright/test";

test.describe("Trip details editorial surfaces (US-RF-018)", () => {
  test("da-nang trip planning surface renders editorial day rail, timeline, and AI assistant", async ({
    page
  }) => {
    await page.goto("/trips/da-nang");

    await expect(page.getByTestId("trip-app-shell")).toBeVisible();
    await expect(page.getByTestId("trip-cover-header")).toBeVisible();
    await expect(page.getByTestId("trip-section-tabs")).toBeVisible();
    await expect(page.getByTestId("planning-surface")).toBeVisible();
    await expect(page.getByTestId("trip-day-rail")).toBeVisible();
    await expect(page.getByTestId("trip-timeline")).toBeVisible();
    await expect(page.getByTestId("trip-route-overview")).toBeVisible();
    await expect(page.getByTestId("ai-assistant-card")).toBeVisible();
  });

  test("Memories tab navigates to the memories surface with Trip Vault", async ({
    page
  }) => {
    await page.goto("/trips/da-nang/memories");

    await expect(page.getByTestId("memories-surface")).toBeVisible();
    await expect(page.getByTestId("trip-vault-card")).toBeVisible();
    await expect(
      page.getByTestId("trip-vault-stat-photos")
    ).toBeVisible();
  });

  test("Expenses tab navigates to the expenses surface with stat cards", async ({
    page
  }) => {
    await page.goto("/trips/da-nang/expenses");

    await expect(page.getByTestId("expenses-surface")).toBeVisible();
    expect(
      await page.getByTestId("trip-stat-card").count()
    ).toBeGreaterThanOrEqual(4);
    await expect(page.getByTestId("budget-usage-bar")).toBeVisible();
    await expect(page.getByTestId("expenses-budget-usage")).toBeVisible();
    await expect(page.getByTestId("expenses-settlement")).toBeVisible();
    await expect(page.getByTestId("ai-insight-card")).toBeVisible();
  });
});
