import { Locator, Page, test } from '@playwright/test';

export class ConfirmDialog {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('dialog');
  }

  async confirm(label: string): Promise<void> {
    await test.step(`confirm with "${label}"`, async () => {
      await this.root.getByRole('button', { name: label }).click();
    });
  }
}
