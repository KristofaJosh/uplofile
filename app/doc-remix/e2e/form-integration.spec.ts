import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("Form Integration", () => {
  test("submits form with uploaded file", async ({ page }) => {
    await page.goto("/examples/form");
    await page.locator('[data-part="root"]').waitFor();

    await page.getByPlaceholder("e.g. Project Proposal Q1").fill("Test Project");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const doneIcon = root.locator("svg.text-emerald-500");
    await expect(doneIcon).toBeVisible({ timeout: 30000 });

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Form submitted! Check console for data.");
      await dialog.accept();
    });

    await page.getByRole("button", { name: /submit application/i }).click();
  });
});
