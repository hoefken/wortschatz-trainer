import { Locator, Page, test } from '@playwright/test';

export class WordPairTable {
  readonly rows: Locator;
  readonly actionCells: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('tbody tr');
    this.actionCells = page.locator('td.mat-column-actions');
  }

  row(source: string): Locator {
    return this.rows.filter({ hasText: source });
  }

  column(index: number): Locator {
    return this.rows.locator(`td:nth-child(${index + 1})`);
  }

  editButton(source: string): Locator {
    return this.page.getByRole('button', { name: `${source} bearbeiten` });
  }

  deleteButton(source: string): Locator {
    return this.page.getByRole('button', { name: `${source} löschen` });
  }

  async sortBy(language: string): Promise<void> {
    await test.step(`sort by "${language}"`, async () => {
      await this.page.getByRole('button', { name: language, exact: true }).click();
    });
  }
}
