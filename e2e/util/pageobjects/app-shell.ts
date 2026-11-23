import { Locator, Page, test } from '@playwright/test';

export class AppShell {
  readonly heading: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name });
  }

  async openSection(name: string): Promise<void> {
    await test.step(`open section "${name}"`, async () => {
      await this.tab(name).click();
    });
  }
}
