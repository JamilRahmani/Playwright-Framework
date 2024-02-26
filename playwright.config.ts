import { ScreenshotMode, VideoMode, defineConfig, devices } from '@playwright/test'
 
/**
* Read environment variables from file.
* https://github.com/motdotla/dotenv
*/
require('dotenv').config()
 
/**
* See https://playwright.dev/docs/test-configuration.
*/
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: process.env.FULLY_PARALLEL === 'true',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Recommended is 0 due to likelihood of being unable to recreate same-named resources on secondary runs. */
  retries: parseInt(process.env.RETRIES ?? '0', 10),
  /* Recommended is 1 due to scheduling collisions. */
  workers: parseInt(process.env.WORKERS ?? '1', 10),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  /* Each test is given 30 seconds. */
  timeout: parseInt(process.env.TIMEOUT ?? '60000', 10),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BETA_URL,
 
    /*  Emulates the user timezone based on environment variable. See https://playwright.dev/docs/emulation */
    timezoneId: process.env.USE__TIMEZONE ?? 'US/Eastern',
 
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
 
    headless: process.env.USE__HEADLESS === 'true',
 
    launchOptions: {
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
      slowMo: process.env.USE__LAUNCHOPTIONS__SLOWMO === 'true' ? 1000 : undefined,
    },
 
    /* Artifacts */
    screenshot: (process.env.USE__SCREENSHOT as ScreenshotMode) ?? 'only-on-failure',
    video: (process.env.USE__VIDEO as VideoMode) ?? 'retain-on-failure',
  },
  /* Configuration for the expect assertion library. */
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: parseInt(process.env.EXPECT__TIMEOUT ?? '30000', 10),
  },
  globalSetup: require.resolve('./playwright/setup/setup.global.ts'),
  /* Configure projects for major browsers */
  projects: [
    // Setup project
    {
      name: 'setup',
      testDir: './playwright/setup',
      testMatch: /setup\..*\.ts/,
    },
 
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
 
    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
 
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/
 
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
 
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
 
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})