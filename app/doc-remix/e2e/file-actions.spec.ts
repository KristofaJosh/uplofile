import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("File Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/file-list");
    await page.locator('[data-part="root"]').waitFor();
  });

  test("uploads a file and removes it", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    await expect(root.getByText("done")).toBeVisible({ timeout: 30000 });

    const removeButton = root.locator('[data-part="remove"]');
    await removeButton.click();

    await expect(root.getByText("No files added yet.")).toBeVisible({
      timeout: 10000,
    });
    await expect(root.getByText("test.txt")).not.toBeVisible();
  });
});
