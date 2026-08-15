import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://uplofile.kristofajosh.dev";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicRoutes = [
  "/",
  "/installation",
  "/quick-start",
  "/components/root",
  "/components/trigger",
  "/components/preview",
  "/components/dropzone",
  "/components/hidden-input",
  "/api/props",
  "/api/actions",
  "/api/use-uplofile",
  "/examples/default-preview",
  "/examples/basic",
  "/examples/dropzone",
  "/examples/image-gallery",
  "/examples/sortable-gallery",
  "/examples/avatar",
  "/examples/file-list",
  "/examples/video",
  "/examples/validation",
  "/examples/form",
  "/examples/root-imperative",
  "/examples/loading-state",
  "/examples/pause-resume",
  "/examples/batch-upload",
];

for (const pathname of [
  "/",
  "/quick-start",
  "/components/root",
  "/api/actions",
  "/examples/batch-upload",
]) {
  test(`${pathname} renders one complete social metadata set`, async ({
    page,
  }) => {
    const response = await page.goto(pathname);

    expect(response?.status()).toBe(200);
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page).toHaveTitle(/Uplofile/);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(
      1,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);

    const expectedCanonical = new URL(pathname, siteUrl).toString();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expectedCanonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      expectedCanonical,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      await page.title(),
    );
  });
}

test("social image is served as a 1200×630 PNG", async ({ request }) => {
  const response = await request.get("/og-image.png");
  const image = await response.body();

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
  expect(image.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);
});

test("dynamic sitemap lists every public route exactly once", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  const sitemap = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toMatch(
    /(?:application|text)\/xml/,
  );
  expect(sitemap).not.toContain("/sitemap.xml</loc>");

  for (const pathname of publicRoutes) {
    expect(sitemap).toContain(`<loc>${new URL(pathname, siteUrl)}</loc>`);
  }

  expect(sitemap.match(/<loc>/g) ?? []).toHaveLength(publicRoutes.length);
});

test("every Uplofile URL in llms.txt resolves", async ({ request }) => {
  const llms = await readFile(
    path.resolve(__dirname, "../public/llms.txt"),
    "utf8",
  );
  const urls = [
    ...llms.matchAll(/https:\/\/uplofile\.kristofajosh\.dev[^\s)]*/g),
  ].map(([url]) => url);

  expect(urls.length).toBeGreaterThan(0);

  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    expect(response.status(), url).toBe(200);
  }
});
