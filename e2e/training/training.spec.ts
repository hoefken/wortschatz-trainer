import { expect } from '@playwright/test';
import { Navigation } from '../util/pageobjects/navigation';
import { Domain } from '../util/pageobjects/domain';
import { solutionFor, WRONG_ANSWER } from '../util/sample-words';
import { fixtureBase } from '../util/fixture-base';
import { TrainingPage } from './pageobjects/training-page';

const test = fixtureBase;

test.describe('Section "Trainieren"', () => {
  let navigation: Navigation;
  let domain: Domain;
  let trainingPage: TrainingPage;

  test.beforeEach(async ({ navigation: nav, domain: steps, trainingPage: training }) => {
    navigation = nav;
    domain = steps;
    trainingPage = training;
  });

  test('links to "Erfassen" while there are no word pairs', async () => {
    await test.step('show the empty state', async () => {
      await navigation.openSection('Trainieren');

      await expect(trainingPage.emptyState).toBeVisible();
    });

    await test.step('go to "Erfassen"', async () => {
      await trainingPage.goToVocabulary();

      await expect(navigation.page).toHaveURL(/\/vocabulary$/);
    });
  });

  test.describe('with "Beispieldaten"', () => {
    let word: string | null;
    let solution: string;

    test.beforeEach(async () => {
      await domain.addSamples();
      await navigation.openSection('Trainieren');
      word = await trainingPage.word.textContent();
      solution = solutionFor(word);
    });

    test('accepts the right answer ignoring case and asks the next word', async () => {
      await test.step('answer in upper case', async () => {
        await trainingPage.answer(solution.toUpperCase());

        await expect(trainingPage.feedback).toContainText('Richtig!');
        await expect(trainingPage.correctCount).toHaveText('1 richtig');
      });

      await test.step('continue with an empty, focused field and another word', async () => {
        await trainingPage.next();

        await expect(trainingPage.word).not.toHaveText(word ?? '');
        await expect(trainingPage.answerInput).toHaveValue('');
        await expect(trainingPage.answerInput).toBeFocused();
      });
    });

    test('shows the correct word after a wrong answer', async () => {
      await trainingPage.answer(WRONG_ANSWER);

      await expect(trainingPage.feedback).toContainText('Leider falsch.');
      await expect(trainingPage.feedback).toContainText(`Richtig: ${solution}`);
      await expect(trainingPage.feedback).toContainText('kommt in dieser Sitzung öfter dran.');
      await expect(trainingPage.wrongCount).toHaveText('1 falsch');
    });

    test('asks for an answer before checking', async () => {
      await trainingPage.answer('');

      await expect(trainingPage.errors).toHaveText(['Bitte eine Antwort eingeben.']);
      await expect(trainingPage.wrongCount).toHaveText('0 falsch');
    });

    test('keeps the round and score when switching sections', async () => {
      await trainingPage.answer(WRONG_ANSWER);

      await test.step('leave for "Erfassen" and come back', async () => {
        await navigation.openSection('Erfassen');
        await navigation.openSection('Trainieren');

        await expect(trainingPage.wrongCount).toHaveText('1 falsch');
        await expect(trainingPage.feedback).toContainText('Leider falsch.');
        await expect(trainingPage.answerInput).toBeFocused();
      });
    });
  });
});
