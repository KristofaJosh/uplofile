import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "fixtures");

test.describe("Upload Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/validation");
    await page.locator('[data-part="root"]').waitFor();
  });

  test("rejects file larger than 2MB", async ({ page }) => {
    const largeFilePath = path.resolve(fixturesDir, "large-test.bin");
    fs.writeFileSync(largeFilePath, Buffer.alloc(3 * 1024 * 1024));

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(largeFilePath);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("File too large (max 2MB)")).toBeVisible({
      timeout: 10000,
    });
  });

  test("rejects file with restricted filename", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles({
      name: "restricted-data.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("test content"),
    });

    const root = page.locator('[data-part="root"]');
    await expect(
      root.getByText("File name contains restricted words"),
    ).toBeVisible({ timeout: 10000 });
  });

  test("accepts valid small file and uploads", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles({
      name: "valid-file.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("small valid file content"),
    });

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("valid-file.txt")).toBeVisible({
      timeout: 10000,
    });

    const doneIcon = root.locator("svg.text-emerald-500");
    await expect(doneIcon).toBeVisible({ timeout: 30000 });
  });
});
