import { expect, test } from '@playwright/test';

test('switches between the three sections', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/vocabulary$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Wortliste' })).toBeVisible();

  await page.getByRole('tab', { name: 'Trainieren' }).click();
  await expect(page).toHaveTitle('Trainieren · Wortschatz-Trainer');
  await expect(page.getByRole('tab', { name: 'Trainieren' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await page.getByRole('tab', { name: 'Prüfung' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Prüfung' })).toBeVisible();
});
