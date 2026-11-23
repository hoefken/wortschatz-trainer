import { fixtureBase } from '../util/fixture-base';
import { VocabularyPage } from './pageobjects/vocabulary-page';

export const fixtureVocabulary = fixtureBase.extend<{ vocabularyPage: VocabularyPage }>({
  vocabularyPage: async ({ page }, use) => {
    const vocabularyPage = new VocabularyPage(page);
    await vocabularyPage.goto();
    await use(vocabularyPage);
  },
});
