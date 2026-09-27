import { defineConfig, devices } from "@playwright/test";

// E2E tests run against the production build served by `vite preview`.
// Locally, set PW_CHANNEL=chrome to reuse an installed Google Chrome instead of downloading
// Playwright's Chromium; the Docker image and CI use the bundled browser.
const channel = process.env.PW_CHANNEL || undefined;
// E2E_BASE_URL runs the suite against a deployed site (e.g. a Vercel preview) instead of `vite preview`.
// Tests navigate with relative paths ("./…"), so a sub-path URL such as https://host/egitim/ works too.
const deployedUrl = process.env.E2E_BASE_URL && process.env.E2E_BASE_URL.replace(/\/?$/, "/");
const webglArgs = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: deployedUrl || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    launchOptions: { args: webglArgs },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, channel } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 }, channel } },
  ],
  webServer: deployedUrl ? undefined : {
    command: "npm run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
