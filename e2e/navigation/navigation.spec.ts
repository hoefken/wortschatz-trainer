import { expect } from '@playwright/test';
import { fixtureBase } from '../util/fixture-base';
import { Navigation } from '../util/pageobjects/navigation';

const test = fixtureBase;

test.describe('Navigation', () => {
  let navigation: Navigation;

  test.beforeEach(async ({ navigation: nav }) => {
    navigation = nav;
  });

  test('switches between the three sections', async () => {
    await test.step('start on "Erfassen"', async () => {
      await expect(navigation.page).toHaveURL(/\/vocabulary$/);
      await expect(navigation.heading).toHaveText('Wortliste');
    });

    await test.step('show "Trainieren" as selected tab with its page title', async () => {
      await navigation.openSection('Trainieren');

      await expect(navigation.page).toHaveTitle('Trainieren · Wortschatz-Trainer');
      await expect(navigation.tab('Trainieren')).toHaveAttribute('aria-selected', 'true');
    });

    await test.step('show the heading of "Prüfung"', async () => {
      await navigation.openSection('Prüfung');

      await expect(navigation.heading).toHaveText('Prüfung');
    });
  });
});
