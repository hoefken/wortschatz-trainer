import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/vocabulary');
});

test('adds, edits and deletes a word pair', async ({ page }) => {
  const rows = page.getByRole('row');

  await page.getByRole('button', { name: 'Hinzufügen' }).click();
  const addDialog = page.getByRole('dialog', { name: 'Wortpaar hinzufügen' });
  await addDialog.getByLabel('Deutsch').fill('Bahnhof');
  await addDialog.getByLabel('Englisch').fill('station');
  await addDialog.getByLabel('Englisch').press('Enter');
  await expect(rows.filter({ hasText: 'Bahnhof' })).toContainText('station');
  await expect(page.getByText('1 Wortpaar', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Bahnhof bearbeiten' }).click();
  const editDialog = page.getByRole('dialog', { name: 'Wortpaar bearbeiten' });
  await editDialog.getByLabel('Englisch').fill('train station');
  await editDialog.getByRole('button', { name: 'Speichern' }).click();
  await expect(rows.filter({ hasText: 'Bahnhof' })).toContainText('train station');

  await page.getByRole('button', { name: 'Bahnhof löschen' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Löschen' }).click();
  await expect(page.getByRole('heading', { name: 'Noch keine Wortpaare' })).toBeVisible();
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 1280, height: 900 },
  { width: 1920, height: 1080 },
  { width: 3440, height: 1440 },
]) {
  test.describe(`at ${viewport.width} px`, () => {
    test.use({ viewport });

    test('shows both row actions uncut', async ({ page }) => {
      await page.getByRole('button', { name: 'Beispieldaten einfügen' }).click();

      for (const name of ['Apfel bearbeiten', 'Apfel löschen']) {
        const icon = page.getByRole('button', { name }).locator('svg');
        await expect(icon).toBeVisible();
        await expect(icon).toBeInViewport({ ratio: 1 });
      }
      const actionCells = page.locator('td.mat-column-actions');
      for (const cell of await actionCells.all()) {
        expect(await cell.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(
          true,
        );
      }
    });
  });
}

test('fills sample data and resets everything', async ({ page }) => {
  await page.getByRole('button', { name: 'Beispieldaten einfügen' }).click();
  await expect(page.getByText('9 Wortpaare')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Beispieldaten einfügen' })).toBeDisabled();

  await page.getByRole('button', { name: 'Alles zurücksetzen' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Alles löschen' }).click();
  await expect(page.getByText('0 Wortpaare')).toBeVisible();
});
