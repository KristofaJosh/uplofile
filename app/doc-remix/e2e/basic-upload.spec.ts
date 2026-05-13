import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

async function uploadViaTrigger(page: ReturnType<typeof test.page>, filePath: string) {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator('[data-part="trigger"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
}

test.describe("Basic Upload", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/basic");
    await page.locator('[data-part="root"]').waitFor();
  });

  test("uploads a file and shows done state", async ({ page }) => {
    const root = page.locator('[data-part="root"]');
    await uploadViaTrigger(page, testFile);

    await expect(root.getByText("test.txt")).toBeVisible();

    const doneIcon = root.locator("svg.text-emerald-500");
    await expect(doneIcon).toBeVisible({ timeout: 30000 });

    await expect(root.getByText("No files selected")).not.toBeVisible();
  });

  test("shows uploading progress then completion", async ({ page }) => {
    await uploadViaTrigger(page, testFile);

    const progressBar = page.locator('[data-part="root"] .bg-primary.h-full');
    await expect(progressBar).toBeVisible({ timeout: 5000 });

    const checkIcon = page.locator('[data-part="root"] svg.text-emerald-500');
    await expect(checkIcon).toBeVisible({ timeout: 30000 });
  });
});
