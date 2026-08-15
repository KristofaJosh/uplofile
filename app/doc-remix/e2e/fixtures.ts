import { test as base } from "@playwright/test";

// mockUpload (see app/lib/utils.ts) rolls Math.random() against a
// failChance to decide whether a simulated upload succeeds or fails.
// Specs default to a deterministic "success" so assertions on the eventual
// upload outcome aren't flaky; override with test.use({ mockUploadOutcome })
// for specs that need to force the failure path instead.
export const test = base.extend<{ mockUploadOutcome: "success" | "failure" }>({
  mockUploadOutcome: ["success", { option: true }],
  page: async ({ page, mockUploadOutcome }, use) => {
    const value = mockUploadOutcome === "success" ? 1 : 0;
    await page.addInitScript((v) => {
      Math.random = () => v;
    }, value);
    await use(page);
  },
});

export { expect } from "@playwright/test";
