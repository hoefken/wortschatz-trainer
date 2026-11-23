import { expect, Locator, Page, test } from '@playwright/test';

export class WordPairDialog {
  readonly root: Locator;
  readonly sourceInput: Locator;
  readonly targetInput: Locator;
  readonly submitButton: Locator;
  readonly errors: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('dialog');
    this.sourceInput = this.root.getByLabel('Deutsch');
    this.targetInput = this.root.getByLabel('Englisch');
    this.submitButton = this.root.getByRole('button', { name: /^(Hinzufügen|Speichern)$/ });
    this.errors = this.root.locator('mat-error');
  }

  // The dialog moves focus to its first field once the open animation ends; typing earlier
  // can land in the wrong field.
  async waitUntilOpen(): Promise<void> {
    await expect(this.sourceInput).toBeFocused();
  }

  async fill(source: string, target: string): Promise<void> {
    await test.step(`enter "${source}" and "${target}"`, async () => {
      await this.sourceInput.fill(source);
      await this.targetInput.fill(target);
    });
  }

  async fillTarget(target: string): Promise<void> {
    await test.step(`enter translation "${target}"`, async () => {
      await this.targetInput.fill(target);
    });
  }

  async submit(): Promise<void> {
    await test.step('submit by button', async () => {
      await this.submitButton.click();
    });
  }

  async submitWithEnter(): Promise<void> {
    await test.step('submit with Enter', async () => {
      await this.targetInput.press('Enter');
    });
  }
}
