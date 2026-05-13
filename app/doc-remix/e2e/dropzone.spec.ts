import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFile = path.resolve(__dirname, "fixtures", "test.txt");

test.describe("Dropzone Upload", () => {
  test("shows dragging state on dragEnter and uploads via file chooser", async ({ page }) => {
    await page.goto("/examples/dropzone");
    await page.locator('[data-part="root"]').waitFor();
    await page.locator('[data-part="dropzone"]').waitFor();

    const dropzone = page.locator('[data-part="dropzone"]');
    await expect(dropzone).not.toHaveAttribute("data-dragging");

    await page.evaluate(() => {
      const el = document.querySelector('[data-part="dropzone"]');
      if (!el) return;
      const dt = new DataTransfer();
      const blob = new Blob(["test"], { type: "text/plain" });
      const file = new File([blob], "test.txt", { type: "text/plain" });
      dt.items.add(file);
      el.dispatchEvent(
        new DragEvent("dragenter", { dataTransfer: dt, bubbles: true }),
      );
    });

    await expect(dropzone).toHaveAttribute("data-dragging", "true");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-part="trigger"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);

    const root = page.locator('[data-part="root"]');
    await expect(root.getByText("test.txt")).toBeVisible({ timeout: 10000 });

    const doneIcon = root.locator("svg.text-emerald-500");
    await expect(doneIcon).toBeVisible({ timeout: 30000 });
  });
});
