import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev for more options.
 */
export default defineConfig({
  // Root directory where Playwright looks for test files
  testDir: "./tests",

  // Run tests inside individual files in parallel for faster execution
  fullyParallel: true,

  // Fail the build on CI if a single test fails, or configure parallel workers
  workers: process.env.CI ? 1 : undefined,

  // CONFIGURACIÓN OPTIMIZADA: Usa 'github' en CI y 'html' en local
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["html", { open: "always" }]],

  // Shared configuration settings for all testing projects (browsers)
  use: {
    // Target base URL for REVEL to avoid writing absolute paths in specs
    baseURL: "https://driverevel.com",

    // Collect multimedia tracing telemetry only when a test fails during a retry
    trace: "on-first-retry",

    // Automatically capture a screenshot if a test assertion fails
    screenshot: "only-on-failure",

    // Record video files of the test execution session on failure
    video: "retain-on-failure",
  },

  /* Multi-browser orchestration projects targeting different layout engines */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
*/
  ],
});
