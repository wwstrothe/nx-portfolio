import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';

const port = 4301; // <-- changed from 4300 to avoid conflicts
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  webServer: {
    command: `pnpm exec nx serve-static portfolio --port=${port}`,
    url: baseURL,

    // IMPORTANT on Windows: avoid "reusing" a stale server
    reuseExistingServer: false,

    cwd: workspaceRoot,

    // Give it more time to build + start the file server
    timeout: 180_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
