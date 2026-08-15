import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 5173);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // CI serves the production build instead of the Vite dev server: dev
    // mode transforms each route's modules on demand on first request, and
    // that latency stacks with hydration under the CPU contention of
    // multiple parallel workers, causing trigger clicks to land before
    // React attaches its listeners (Playwright's file-chooser wait then
    // times out). The prebuilt server has no such on-demand transform cost.
    command: process.env.CI
      ? "pnpm exec react-router-serve ./build/server/index.js"
      : `pnpm exec react-router dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: { PORT: String(PORT) },
  },
});
