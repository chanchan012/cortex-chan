import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3187";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 2,
  use: { baseURL, trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3187",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "", CLERK_SECRET_KEY: "",
      UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "compact", use: { viewport: { width: 320, height: 568 } } },
    { name: "landscape", use: { viewport: { width: 844, height: 390 } } },
  ],
});
