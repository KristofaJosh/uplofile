import { test, expect } from "@playwright/test";

test.describe("Loading State", () => {
  const declarativeRoot = (page: ReturnType<typeof test.page>) =>
    page
      .locator("section")
      .filter({ hasText: "Declarative gating" })
      .locator('[data-part="root"]');

  test("shows loading state during async initial hydration", async ({ page }) => {
    await page.goto("/examples/loading-state");
    const root = declarativeRoot(page);

    await expect(
      root.getByRole("button", { name: /loading initial files/i }),
    ).toBeVisible({ timeout: 8000 });

    await expect(
      root.getByText("Select Images").first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows initial file after hydration completes", async ({ page }) => {
    await page.goto("/examples/loading-state");
    const root = declarativeRoot(page);
    await root.waitFor();

    await expect(
      root.getByAltText("server-image.jpg"),
    ).toBeVisible({ timeout: 10000 });

    await expect(
      root.getByRole("button", { name: /loading initial files/i }),
    ).not.toBeVisible();
  });

  test("shows skeleton placeholders while loading", async ({ page }) => {
    await page.goto("/examples/loading-state");
    const root = declarativeRoot(page);
    await root.waitFor();

    const skeleton = root.locator(".animate-pulse");
    await expect(skeleton.first()).toBeVisible({ timeout: 5000 });

    await expect(root.getByAltText("server-image.jpg")).toBeVisible({
      timeout: 10000,
    });

    await expect(skeleton.first()).not.toBeVisible({ timeout: 5000 });
  });
});
