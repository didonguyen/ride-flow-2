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

  test("Add Day adds a new day in the planning tab", async ({ page }) => {
    await page.goto("/trips/nam-cat-tien");
    const before = await page.locator('[data-testid^="trip-day-rail-day-"]').count();
    await page.getByTestId("trip-day-rail-add").click();
    const after = await page.locator('[data-testid^="trip-day-rail-day-"]').count();
    expect(after).toBe(before + 1);
  });

  test("Expenses tab: Edit Details + Start Ride + Settle all + Split equally + Add expense all work", async ({
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

    await page.getByTestId("expenses-edit-details").click();
    await expect(page.getByTestId("expenses-edit-details")).toHaveText(
      /Editing/
    );

    await page.getByTestId("expenses-start-ride").click();
    await expect(page.getByTestId("expenses-start-ride")).toHaveText(/Riding/);

    await page.getByTestId("expenses-split-equally").click();
    await expect(page.getByTestId("expenses-split-equally")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await page.getByTestId("expenses-add").click();
    await expect(page.getByTestId("expenses-add-confirmation")).toBeVisible();

    await page.getByTestId("expenses-settle-all").click();
    await expect(
      page.getByTestId("expenses-settle-confirmation")
    ).toBeVisible();
  });

  test("Memories tab: Add Memory + Add Day all work", async ({ page }) => {
    await page.goto("/trips/nam-cat-tien/memories");

    await expect(page.getByTestId("memories-surface")).toBeVisible();
    await expect(page.getByTestId("memories-timeline")).toBeVisible();
    await expect(page.getByTestId("trip-vault-card")).toBeVisible();

    await page.getByTestId("trip-vault-add").click();
    await expect(page.getByTestId("memories-add-confirmation")).toBeVisible();

    const before = await page.locator('[data-testid^="trip-day-rail-day-"]').count();
    await page.getByTestId("trip-day-rail-add").click();
    const after = await page.locator('[data-testid^="trip-day-rail-day-"]').count();
    expect(after).toBe(before + 1);
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
