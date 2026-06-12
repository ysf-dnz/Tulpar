import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /motion\.spec\.ts/,
    },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } },
      testMatch: /motion\.spec\.ts/,
    },
  ],
});
