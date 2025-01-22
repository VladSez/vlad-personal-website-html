// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = process.env.BASE_URL ?? `http://localhost:3000`;

/**
/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./e2e",
  // Timeout per test
  timeout: 45 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run your local dev server before starting the tests.
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  // on CI we don't need to start the server, because we use vercel preview url to run the tests
  ...(!process.env.CI && {
    webServer: {
      command: "pnpm run dev",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000, // Add timeout for slow starts
    },
  }),
});
