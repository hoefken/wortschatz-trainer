import { fixtureVocabulary } from '../vocabulary/fixture-vocabulary';
import { TrainingPage } from './pageobjects/training-page';

// Starts in "Erfassen": word pairs live in memory only, so a test first adds them there
// and then opens "Trainieren" through the tab instead of reloading the page.
export const fixtureTraining = fixtureVocabulary.extend<{ trainingPage: TrainingPage }>({
  trainingPage: async ({ page }, use) => {
    await use(new TrainingPage(page));
  },
});
