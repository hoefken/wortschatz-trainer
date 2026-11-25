import { test } from '@playwright/test';
import { ExamPage } from '../exam/pageobjects/exam-page';
import { TrainingPage } from '../training/pageobjects/training-page';
import { VocabularyPage } from '../vocabulary/pageobjects/vocabulary-page';
import { Domain } from './pageobjects/domain';
import { Navigation } from './pageobjects/navigation';

interface Fixtures {
  navigation: Navigation;
  vocabularyPage: VocabularyPage;
  trainingPage: TrainingPage;
  examPage: ExamPage;
  domain: Domain;
}

// Every page object comes from here, so a spec and `domain` act on the same instances.
// `navigation` opens the app, which lands on "Erfassen".
export const fixtureBase = test.extend<Fixtures>({
  navigation: async ({ page }, use) => {
    await page.goto('/');
    await use(new Navigation(page));
  },
  vocabularyPage: async ({ navigation }, use) => {
    await use(new VocabularyPage(navigation.page));
  },
  trainingPage: async ({ navigation }, use) => {
    await use(new TrainingPage(navigation.page));
  },
  examPage: async ({ navigation }, use) => {
    await use(new ExamPage(navigation.page));
  },
  domain: async ({ navigation, vocabularyPage }, use) => {
    await use(new Domain(navigation, vocabularyPage));
  },
});
