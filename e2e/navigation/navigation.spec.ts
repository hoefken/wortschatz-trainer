import { expect } from '@playwright/test';
import { fixtureBase } from '../util/fixture-base';
import { AppShell } from '../util/pageobjects/app-shell';

const test = fixtureBase;

test.describe('Navigation', () => {
  let appShell: AppShell;

  test.beforeEach(async ({ appShell: shell }) => {
    appShell = shell;
  });

  test('switches between the three sections', async () => {
    await test.step('start on "Erfassen"', async () => {
      await expect(appShell.page).toHaveURL(/\/vocabulary$/);
      await expect(appShell.heading).toHaveText('Wortliste');
    });

    await test.step('show "Trainieren" as selected tab with its page title', async () => {
      await appShell.openSection('Trainieren');

      await expect(appShell.page).toHaveTitle('Trainieren · Wortschatz-Trainer');
      await expect(appShell.tab('Trainieren')).toHaveAttribute('aria-selected', 'true');
    });

    await test.step('show the heading of "Prüfung"', async () => {
      await appShell.openSection('Prüfung');

      await expect(appShell.heading).toHaveText('Prüfung');
    });
  });
});
