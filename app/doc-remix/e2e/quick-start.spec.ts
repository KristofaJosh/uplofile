import { expect, test } from "@playwright/test";

test("quick start shows both files and previews a mock upload", async ({
  page,
}) => {
  const uploadRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/upload")) {
      uploadRequests.push(request.url());
    }
  });

  await page.goto("/quick-start");
  await expect(page.getByRole("tab").first()).toHaveText("Uploader.tsx");
  await expect(page.getByRole("tab", { name: "Uploader.tsx" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText(
    "export default function Uploader",
  );
  await page.getByRole("tab", { name: "upload.ts" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "export async function upload",
  );
  await expect(
    page.getByRole("button", { name: "Drop files here" }),
  ).toBeVisible();

  const chooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Or select files" }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: "sample.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello"),
  });

  await expect(page.locator('#preview [data-state="done"]')).toHaveAttribute(
    "aria-label",
    "sample.txt - Done",
    { timeout: 30_000 },
  );
  expect(uploadRequests).toEqual([]);
});
