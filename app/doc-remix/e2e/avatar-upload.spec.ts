import { test, expect } from "@playwright/test";
import { Buffer } from "node:buffer";

test.describe("Avatar Upload", () => {
  test("uploads a single file and shows preview", async ({ page }) => {
    await page.goto("/examples/avatar");
    await page.locator('[data-part="root"]').waitFor();

    const root = page.locator('[data-part="root"]');
    const trigger = root.locator('[data-part="trigger"]');
    await expect(trigger).toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await trigger.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: "avatar.png", mimeType: "image/png", buffer: Buffer.from("fake image") },
    ]);

    const previewImage = root.locator("img");
    await expect(previewImage).toBeVisible({ timeout: 30000 });

    await expect(previewImage).toHaveAttribute("src", /^blob:/);
  });
});
