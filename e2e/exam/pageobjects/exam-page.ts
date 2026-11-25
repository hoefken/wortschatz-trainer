import { Locator, Page, test } from '@playwright/test';
import { ConfirmDialog } from '../../util/pageobjects/confirm-dialog';

export class ExamPage {
  readonly limitInput: Locator;
  readonly passRateSlider: Locator;
  readonly passHint: Locator;
  readonly errors: Locator;
  readonly progress: Locator;
  readonly word: Locator;
  readonly answerInput: Locator;
  readonly verdict: Locator;
  readonly statistics: Locator;
  readonly mistakes: Locator;
  readonly emptyState: Locator;
  readonly cancelDialog: ConfirmDialog;

  constructor(private readonly page: Page) {
    this.limitInput = page.getByRole('spinbutton', { name: 'Anzahl Wörter' });
    this.passRateSlider = page.getByRole('slider', { name: 'Nötige Trefferquote' });
    this.passHint = page.getByText(/Bestanden ab \d+ von/);
    this.errors = page.locator('mat-error');
    this.progress = page.getByRole('heading', { level: 1, name: /^Frage \d+ von \d+$/ });
    this.word = page.getByRole('heading', { level: 2 });
    this.answerInput = page.getByRole('textbox', { name: 'Deine Antwort' });
    this.verdict = page.getByRole('heading', { level: 2, name: /bestanden$/i });
    this.statistics = page.getByRole('definition');
    this.mistakes = page.getByRole('listitem');
    this.emptyState = page.getByRole('heading', { name: 'Noch keine Wörter für eine Prüfung' });
    this.cancelDialog = new ConfirmDialog(page);
  }

  async setLimit(limit: number): Promise<void> {
    await test.step(`set "Anzahl Wörter" to ${limit}`, async () => {
      await this.limitInput.fill(String(limit));
    });
  }

  async setPassRateToMinimum(): Promise<void> {
    await test.step('move "Nötige Trefferquote" to its minimum with Home', async () => {
      await this.passRateSlider.press('Home');
    });
  }

  async start({ limit }: { limit?: number } = {}): Promise<void> {
    if (limit !== undefined) {
      await this.setLimit(limit);
    }
    await test.step('click "Prüfung starten"', async () => {
      await this.page.getByRole('button', { name: 'Prüfung starten' }).click();
    });
  }

  async answer(answer: string): Promise<void> {
    await test.step(`answer "${answer}" and press Enter`, async () => {
      await this.answerInput.fill(answer);
      await this.answerInput.press('Enter');
    });
  }

  async cancel(choice: string): Promise<void> {
    await test.step(`click "Prüfung abbrechen" and choose "${choice}"`, async () => {
      await this.page.getByRole('button', { name: 'Prüfung abbrechen' }).click();
      await this.cancelDialog.choose(choice);
    });
  }
}
