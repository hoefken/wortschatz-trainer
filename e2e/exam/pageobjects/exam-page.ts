import { Locator, Page, test } from '@playwright/test';
import { ConfirmDialog } from '../../util/pageobjects/confirm-dialog';

export class ExamPage {
  readonly countInput: Locator;
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

  constructor(readonly page: Page) {
    this.countInput = page.getByRole('spinbutton', { name: 'Anzahl Wörter' });
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

  async setCount(count: number): Promise<void> {
    await test.step(`set "Anzahl Wörter" to ${count}`, async () => {
      await this.countInput.fill(String(count));
    });
  }

  async start(count?: number): Promise<void> {
    if (count !== undefined) {
      await this.setCount(count);
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

  async cancel(confirmLabel: string): Promise<void> {
    await test.step(`click "Prüfung abbrechen" and confirm "${confirmLabel}"`, async () => {
      await this.page.getByRole('button', { name: 'Prüfung abbrechen' }).click();
      await this.cancelDialog.confirm(confirmLabel);
    });
  }
}
