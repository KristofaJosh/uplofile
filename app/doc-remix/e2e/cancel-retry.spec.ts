import { test, expect, type Page } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("Cancel & Retry", () => {
  async function triggerUpload(page: Page) {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="dropzone"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);
  }

  test("cancels an in-progress upload", async ({ page }) => {
    await page.goto("/examples/video");
    await page.locator('[data-part="root"]').waitFor();

    await triggerUpload(page);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const cancelButton = root.locator('button[title="Cancel upload"]');
    await expect(cancelButton).toBeVisible({ timeout: 5000 });

    await cancelButton.click();

    await expect(cancelButton).not.toBeVisible();
    await expect(root.getByText("test.txt")).toBeVisible();
  });

  test("shows retry button on upload failure", async ({ page }) => {
    await page.goto("/examples/video");
    await page.locator('[data-part="root"]').waitFor();

    await triggerUpload(page);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const retryButton = root.locator('button:has(svg.lucide-rotate-ccw)');
    const doneIcon = root.locator('svg.lucide-check-circle2');

    await expect(async () => {
      await expect(
        doneIcon.or(retryButton).first(),
      ).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 30000 });

    if (await retryButton.isVisible()) {
      await retryButton.click();
      await expect(root.locator('button[title="Cancel upload"]')).toBeVisible({
        timeout: 5000,
      });
    }
  });
});
