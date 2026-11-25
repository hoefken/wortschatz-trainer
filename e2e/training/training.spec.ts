import { expect } from '@playwright/test';
import { AppShell } from '../util/pageobjects/app-shell';
import { SOLUTIONS } from '../util/sample-words';
import { VocabularyPage } from '../vocabulary/pageobjects/vocabulary-page';
import { fixtureTraining } from './fixture-training';
import { TrainingPage } from './pageobjects/training-page';

const test = fixtureTraining;

test.describe('Section "Trainieren"', () => {
  let appShell: AppShell;
  let vocabularyPage: VocabularyPage;
  let trainingPage: TrainingPage;

  test.beforeEach(
    async ({ appShell: shell, vocabularyPage: vocabulary, trainingPage: training }) => {
      appShell = shell;
      vocabularyPage = vocabulary;
      trainingPage = training;
    },
  );

  test('links to "Erfassen" while there are no word pairs', async () => {
    await trainingPage.open();

    await expect(trainingPage.emptyState).toBeVisible();

    await test.step('go to "Erfassen"', async () => {
      await trainingPage.goToVocabulary();

      await expect(vocabularyPage.page).toHaveURL(/\/vocabulary$/);
    });
  });

  test.describe('with "Beispieldaten"', () => {
    let solution: string;

    test.beforeEach(async () => {
      await vocabularyPage.addSamples();
      await trainingPage.open();
      solution = SOLUTIONS.get((await trainingPage.word.textContent()) ?? '') ?? '';
    });

    test('accepts the right answer ignoring case and asks the next word', async () => {
      const word = await trainingPage.word.textContent();

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
      await trainingPage.answer('xyz');

      await expect(trainingPage.feedback).toContainText('Leider falsch.');
      await expect(trainingPage.feedback).toContainText(`Richtig: ${solution}`);
      await expect(trainingPage.wrongCount).toHaveText('1 falsch');
    });

    test('asks for an answer before checking', async () => {
      await trainingPage.answer('');

      await expect(trainingPage.errors).toHaveText(['Bitte eine Antwort eingeben.']);
      await expect(trainingPage.wrongCount).toHaveText('0 falsch');
    });

    test('keeps the round and score when switching sections', async () => {
      await trainingPage.answer('xyz');

      await test.step('leave for "Erfassen" and come back', async () => {
        await appShell.openSection('Erfassen');
        await trainingPage.open();

        await expect(trainingPage.wrongCount).toHaveText('1 falsch');
        await expect(trainingPage.feedback).toContainText('Leider falsch.');
        await expect(trainingPage.answerInput).toBeFocused();
      });
    });
  });
});
