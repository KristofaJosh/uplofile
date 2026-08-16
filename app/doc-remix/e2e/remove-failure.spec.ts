import { test, expect } from "./fixtures.ts";

// Regression coverage for onRemove failure handling (uplofile#31): a failed
// removal must keep the item at status "done" with the error surfaced in the
// built-in Preview grid, and a retried removal must clear that error.
test.describe("Removal failure handling", () => {
  test.describe("onRemove failure", () => {
    // mockOnRemove (see app/lib/utils.ts) shares the same Math.random() <
    // failChance check as mockUpload, so the fixture's failure pin also
    // forces the first removal attempt below to fail.
    test.use({ mockUploadOutcome: "failure" });

    test("keeps the item visible with an error badge/message, then clears it on a successful retry", async ({
      page,
    }) => {
      await page.goto("/examples/simple-preview");
      // Two <Root> instances share this page (built-in preview + custom render).
      const root = page.locator('[data-part="root"]').first();
      await root.waitFor();

      const item = root.locator('[aria-label*="v1.mp4"]').first();
      await expect(item).toBeVisible();
      await expect(item).toHaveAttribute("data-state", "done");

      const removeButton = item.locator('[aria-label="Remove v1.mp4"]');
      await removeButton.click();

      await expect(item.locator('[aria-label="Error"]')).toBeVisible({
        timeout: 10000,
      });
      await expect(
        item.getByText("Server refused deletion (simulated)"),
      ).toBeVisible();
      // Status stays "done" (not "error") — a failed removal is not an upload error.
      await expect(item).toHaveAttribute("data-state", "done");
      await expect(item).toHaveAttribute("aria-label", /error/i);

      // The fixture pins Math.random for the whole test; flip it here so the
      // retry's removal succeeds instead.
      await page.evaluate(() => {
        Math.random = () => 1;
      });
      await removeButton.click();

      // removeMode defaults to "optimistic", so the item vanishes from the
      // DOM synchronously on click regardless of how onRemove eventually
      // resolves — it's only restored if onRemove rejects. A same-tick
      // not.toBeVisible() check would pass even if the retry silently
      // failed, so wait past mockOnRemove's max delay (1800ms) and confirm
      // it hasn't reappeared with an error, proving onRemove actually
      // resolved rather than rejected.
      await expect(item).not.toBeVisible();
      await page.waitForTimeout(2000);
      await expect(item).not.toBeVisible();
    });
  });
});
