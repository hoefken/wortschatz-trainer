import { fixtureVocabulary } from '../vocabulary/fixture-vocabulary';
import { ExamPage } from './pageobjects/exam-page';

// Starts in "Erfassen": word pairs live in memory only, so a test first adds them there
// and then opens "Prüfung" through the tab instead of reloading the page.
export const fixtureExam = fixtureVocabulary.extend<{ examPage: ExamPage }>({
  examPage: async ({ page }, use) => {
    await use(new ExamPage(page));
  },
});
