import { Locator, Page, test } from '@playwright/test';

export class Navigation {
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

  async reload(): Promise<void> {
    await test.step('reload the page', async () => {
      await this.page.reload();
    });
  }

  async goBack(): Promise<void> {
    await test.step('go back in the browser history', async () => {
      await this.page.goBack();
    });
  }
}
