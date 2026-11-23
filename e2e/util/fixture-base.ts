import { test } from '@playwright/test';
import { AppShell } from './pageobjects/app-shell';

export const fixtureBase = test.extend<{ appShell: AppShell }>({
  appShell: async ({ page }, use) => {
    await page.goto('/');
    await use(new AppShell(page));
  },
});
