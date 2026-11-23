import { Locator, Page, test } from '@playwright/test';
import { ConfirmDialog } from '../../util/pageobjects/confirm-dialog';
import { WordPairDialog } from './word-pair-dialog';
import { WordPairTable } from './word-pair-table';

export class VocabularyPage {
  readonly count: Locator;
  readonly addButton: Locator;
  readonly samplesButton: Locator;
  readonly resetButton: Locator;
  readonly emptyState: Locator;
  readonly table: WordPairTable;
  readonly wordPairDialog: WordPairDialog;
  readonly confirmDialog: ConfirmDialog;

  constructor(readonly page: Page) {
    this.count = page.getByText(/^\d+ Wortpaare?$/);
    this.addButton = page.getByRole('button', { name: 'Hinzufügen' });
    this.samplesButton = page.getByRole('button', { name: 'Beispieldaten einfügen' });
    this.resetButton = page.getByRole('button', { name: 'Alles zurücksetzen' });
    this.emptyState = page.getByRole('heading', { name: 'Noch keine Wortpaare' });
    this.table = new WordPairTable(page);
    this.wordPairDialog = new WordPairDialog(page);
    this.confirmDialog = new ConfirmDialog(page);
  }

  async goto(): Promise<void> {
    await test.step('open section "Erfassen"', async () => {
      await this.page.goto('/vocabulary');
    });
  }

  async addSamples(): Promise<void> {
    await test.step('click "Beispieldaten einfügen"', async () => {
      await this.samplesButton.click();
    });
  }

  async openAddDialog(): Promise<void> {
    await test.step('open dialog "Wortpaar hinzufügen"', async () => {
      await this.addButton.click();
      await this.wordPairDialog.waitUntilOpen();
    });
  }

  async openEditDialog(source: string): Promise<void> {
    await test.step(`open dialog "Wortpaar bearbeiten" for "${source}"`, async () => {
      await this.table.editButton(source).click();
      await this.wordPairDialog.waitUntilOpen();
    });
  }

  async deleteWordPair(source: string): Promise<void> {
    await test.step(`delete "${source}" and confirm`, async () => {
      await this.table.deleteButton(source).click();
      await this.confirmDialog.confirm('Löschen');
    });
  }

  async resetAll(): Promise<void> {
    await test.step('click "Alles zurücksetzen" and confirm', async () => {
      await this.resetButton.click();
      await this.confirmDialog.confirm('Alles löschen');
    });
  }
}
