import { test, expect, type Page } from "@playwright/test";
import { Buffer } from "node:buffer";

test.describe("Cancel & Retry", () => {
  const videoFile = {
    name: "test.txt",
    mimeType: "video/mp4" as const,
    buffer: Buffer.from("fake video content"),
  };

  async function triggerUpload(page: Page) {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="dropzone"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([videoFile]);
  }

  test("cancels an in-progress upload", async ({ page }) => {
    await page.goto("/examples/video");
    await page.locator('[data-part="root"]').waitFor();

    await triggerUpload(page);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const cancelButton = root.locator('[data-part="cancel"]');
    await expect(cancelButton).toBeVisible({ timeout: 5000 });

    await cancelButton.click();

    await expect(cancelButton).not.toBeVisible();
    await expect(root.getByText("test.txt")).toBeVisible();
  });

  test("shows retry button on upload failure", async ({ page }) => {
    await page.goto("/examples/video");
    await page.locator('[data-part="root"]').waitFor();

    // Force mockUpload to fail (failChance is 0.4, so any value < 0.4 triggers failure)
    await page.evaluate(() => { Math.random = () => 0; });

    await triggerUpload(page);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const retryButton = root.locator('[data-part="retry"]');
    await expect(retryButton).toBeVisible({ timeout: 30000 });

    // Click retry — Math.random still returns 0, but the uploading phase
    // (~4.5s before the forced failure) is long enough to catch cancel
    await retryButton.click();
    await expect(root.locator('[data-part="cancel"]')).toBeVisible({
      timeout: 5000,
    });
  });
});
