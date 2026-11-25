import { test } from '@playwright/test';
import { VocabularyPage } from '../../vocabulary/pageobjects/vocabulary-page';
import { Navigation } from './navigation';

export class Domain {
  constructor(
    private readonly navigation: Navigation,
    private readonly vocabularyPage: VocabularyPage,
  ) {}

  async addSamples(): Promise<void> {
    await test.step('add "Beispieldaten" in "Erfassen"', async () => {
      await this.navigation.openSection('Erfassen');
      await this.vocabularyPage.addSamples();
    });
  }
}
