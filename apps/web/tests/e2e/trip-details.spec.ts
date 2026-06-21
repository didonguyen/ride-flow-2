import { test, expect } from "@playwright/test";

test.describe("Trip details editorial surfaces (US-RF-018)", () => {
  test("nam-cat-tien planning surface renders the editorial day rail, dashed timeline, and AI assistant", async ({
    page
  }) => {
    await page.goto("/trips/nam-cat-tien");

    await expect(page.getByTestId("trip-app-shell")).toBeVisible();
    await expect(page.getByTestId("trip-cover-header")).toBeVisible();
    await expect(page.getByTestId("trip-section-tabs")).toBeVisible();
    await expect(page.getByTestId("planning-surface")).toBeVisible();
    await expect(page.getByTestId("trip-day-rail")).toBeVisible();
    await expect(page.getByTestId("trip-timeline")).toBeVisible();
    await expect(page.getByTestId("trip-route-overview")).toBeVisible();
    await expect(page.getByTestId("ai-assistant-card")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Nam Cát Tiên Exploration" })
    ).toBeVisible();
  });

  test("Day 2 switch filters the timeline to day-2 stops", async ({ page }) => {
    await page.goto("/trips/nam-cat-tien");

    const day1Button = page.getByTestId("trip-day-rail-day-day-1");
    const day2Button = page.getByTestId("trip-day-rail-day-day-2");
    await expect(day1Button).toHaveAttribute("aria-pressed", "true");

    await day2Button.click();
    await expect(day2Button).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("Sunrise Safari Drive", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText("Depart from HCM", { exact: false })
    ).toHaveCount(0);
  });

  test("Memories tab navigates to the memories surface with Trip Vault", async ({
    page
  }) => {
    await page.goto("/trips/nam-cat-tien/memories");

    await expect(page.getByTestId("memories-surface")).toBeVisible();
    await expect(page.getByTestId("trip-vault-card")).toBeVisible();
    await expect(page.getByTestId("trip-vault-stat-photos")).toBeVisible();
  });

  test("Expenses tab navigates to the expenses surface with stat cards", async ({
    page
  }) => {
    await page.goto("/trips/nam-cat-tien/expenses");

    await expect(page.getByTestId("expenses-surface")).toBeVisible();
    expect(
      await page.getByTestId("trip-stat-card").count()
    ).toBeGreaterThanOrEqual(4);
    await expect(page.getByTestId("budget-usage-bar")).toBeVisible();
    await expect(page.getByTestId("expenses-budget-usage")).toBeVisible();
    await expect(page.getByTestId("expenses-settlement")).toBeVisible();
    await expect(page.getByTestId("ai-insight-card")).toBeVisible();
  });

  test("da-nang trip planning surface still renders editorial day rail, timeline, and AI assistant", async ({
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
});
