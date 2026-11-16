import { defineConfig, devices } from "@playwright/test";

// End-to-end tests: a real browser drives the real page, at the two sizes designed in Figma.
// If the dev server is already running (npm run dev), it is reused.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5174",
    trace: "retain-on-failure", // step-by-step replay of failed tests: npx playwright show-trace
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "phone",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5174",
    reuseExistingServer: true,
    // A placeholder key: the tests fake Web3Forms, so no test ever sends a real email
    env: { VITE_WEB3FORMS_ACCESS_KEY: "test-access-key" },
  },
});
