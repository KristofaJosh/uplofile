import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("Avatar Upload", () => {
  test("uploads a single file and shows preview", async ({ page }) => {
    await page.goto("/examples/avatar");
    await page.locator('[data-part="root"]').waitFor();

    const root = page.locator('[data-part="root"]');
    const userIcon = root.locator("svg.lucide-user");
    await expect(userIcon).toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await root.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);

    const doneIndicator = root.locator("div.bg-emerald-500.rounded-full");
    await expect(doneIndicator).toBeVisible({ timeout: 30000 });

    await expect(userIcon).not.toBeVisible();
  });
});
