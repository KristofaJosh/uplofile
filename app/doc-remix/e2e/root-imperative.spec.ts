import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("Root Imperative API", () => {
  test("opens file dialog via ref.openFileDialog", async ({ page }) => {
    await page.goto("/examples/root-imperative");
    await page.locator('[data-part="root"]').waitFor();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('[data-part="root"] input[type="file"]');
      input?.click();
    });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);

    const root = page.locator('[data-part="root"]');
    await expect(root.locator('[aria-label*="test.txt"]').first()).toBeVisible({ timeout: 10000 });

    await expect(
      root.locator('[data-state="done"]'),
    ).toBeVisible({ timeout: 30000 });
  });
});
