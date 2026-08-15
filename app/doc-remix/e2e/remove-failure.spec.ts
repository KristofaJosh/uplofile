import { test, expect } from "@playwright/test";

// Regression coverage for onRemove failure handling (uplofile#31): a failed
// removal must keep the item at status "done" with the error surfaced in the
// built-in Preview grid, and a retried removal must clear that error.
test.describe("Removal failure handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/simple-preview");
    // Two <Root> instances share this page (built-in preview + custom render).
    await page.locator('[data-part="root"]').first().waitFor();
  });

  test("keeps the item visible with an error badge/message when onRemove fails, then clears it on a successful retry", async ({
    page,
  }) => {
    const root = page.locator('[data-part="root"]').first();
    const item = root.locator('[aria-label*="v1.mp4"]').first();
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("data-state", "done");

    // mockOnRemove fails ~25% of the time (Math.random() < 0.25); forcing
    // Math.random to 0 guarantees the failure branch on this attempt.
    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const removeButton = item.locator('[aria-label="Remove v1.mp4"]');
    await removeButton.click();

    await expect(item.locator('[aria-label="Error"]')).toBeVisible({
      timeout: 5000,
    });
    await expect(
      item.getByText("Server refused deletion (simulated)"),
    ).toBeVisible();
    // Status stays "done" (not "error") — a failed removal is not an upload error.
    await expect(item).toHaveAttribute("data-state", "done");
    await expect(item).toHaveAttribute("aria-label", /error/i);

    // Retrying (Math.random() >= 0.25 guarantees success) clears the error
    // and removes the item.
    await page.evaluate(() => {
      Math.random = () => 1;
    });
    await removeButton.click();

    await expect(item).not.toBeVisible({ timeout: 5000 });
  });
});
