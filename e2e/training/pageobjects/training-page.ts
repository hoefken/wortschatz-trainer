import { Locator, Page, test } from '@playwright/test';

export class TrainingPage {
  readonly correctCount: Locator;
  readonly wrongCount: Locator;
  readonly word: Locator;
  readonly answerInput: Locator;
  readonly errors: Locator;
  readonly feedback: Locator;
  readonly emptyState: Locator;
  readonly vocabularyLink: Locator;

  constructor(private readonly page: Page) {
    this.correctCount = page.getByText(/^\d+ richtig$/);
    this.wrongCount = page.getByText(/^\d+ falsch$/);
    this.word = page.getByRole('heading', { level: 2 });
    this.answerInput = page.getByRole('textbox', { name: 'Deine Antwort' });
    this.errors = page.locator('mat-error');
    this.feedback = page.getByRole('status');
    this.emptyState = page.getByRole('heading', { name: 'Noch keine Wörter zum Üben' });
    this.vocabularyLink = page.getByRole('link', { name: 'Zu „Erfassen“' });
  }

  async answer(answer: string): Promise<void> {
    await test.step(`answer "${answer}" and press Enter`, async () => {
      await this.answerInput.fill(answer);
      await this.answerInput.press('Enter');
    });
  }

  async next(): Promise<void> {
    await test.step('click "Weiter"', async () => {
      await this.page.getByRole('button', { name: 'Weiter' }).click();
    });
  }

  async goToVocabulary(): Promise<void> {
    await test.step('click "Zu „Erfassen“"', async () => {
      await this.vocabularyLink.click();
    });
  }
}
