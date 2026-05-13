import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "fixtures");
const testFile = path.resolve(fixturesDir, "test.txt");

test.describe("Multiple Uploads", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/file-list");
    await page.locator('[data-part="root"]').waitFor();
  });

  test("uploads two files and both show done state", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([testFile, testFile]);

    const root = page.locator('[data-part="root"]');

    const doneIcons = root.locator("svg.text-emerald-500");
    await expect(doneIcons).toHaveCount(2, { timeout: 30000 });

    await expect(root.getByText("No files added yet.")).not.toBeVisible();
  });

  test("uploads files sequentially", async ({ page }) => {
    const root = page.locator('[data-part="root"]');

    const fileChooser1 = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    (await fileChooser1).setFiles([testFile]);
    await expect(root.locator("svg.text-emerald-500")).toBeVisible({
      timeout: 30000,
    });

    const fileChooser2 = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    (await fileChooser2).setFiles([testFile]);
    await expect(root.locator("svg.text-emerald-500")).toHaveCount(2, {
      timeout: 30000,
    });
  });
});
