import { expect } from '@playwright/test';
import { AppShell } from '../util/pageobjects/app-shell';
import { SAMPLE_COUNT, SOLUTIONS } from '../util/sample-words';
import { VocabularyPage } from '../vocabulary/pageobjects/vocabulary-page';
import { fixtureExam } from './fixture-exam';
import { ExamPage } from './pageobjects/exam-page';

const test = fixtureExam;

test.describe('Section "Prüfung"', () => {
  let appShell: AppShell;
  let vocabularyPage: VocabularyPage;
  let examPage: ExamPage;

  test.beforeEach(async ({ appShell: shell, vocabularyPage: vocabulary, examPage: exam }) => {
    appShell = shell;
    vocabularyPage = vocabulary;
    examPage = exam;
  });

  test('links to "Erfassen" while there are no word pairs', async () => {
    await examPage.open();

    await expect(examPage.emptyState).toBeVisible();
  });

  test.describe('with "Beispieldaten"', () => {
    test.beforeEach(async () => {
      await vocabularyPage.addSamples();
      await examPage.open();
    });

    test('asks each chosen word once and shows the result', async () => {
      const asked: string[] = [];

      await examPage.setCount(3);
      await examPage.start();

      // One right, one wrong, one left empty.
      for (const [index, answer] of ['right', 'wrong', ''].entries()) {
        await test.step(`answer question ${index + 1} of 3`, async () => {
          await expect(examPage.progress).toHaveText(`Frage ${index + 1} von 3`);
          const word = (await examPage.word.textContent()) ?? '';
          asked.push(word);

          await examPage.answer(answer === 'right' ? (SOLUTIONS.get(word) ?? '') : answer);
        });
      }

      await test.step('show result and statistics', async () => {
        expect(new Set(asked).size).toBe(3);
        await expect(examPage.verdict).toHaveText('Nicht bestanden');
        await expect(examPage.statistics).toHaveText(['33 %', '1', '2', /^\d+:\d\d$/]);
        await expect(examPage.mistakes).toHaveCount(2);
        await expect(examPage.mistakes.nth(1)).toContainText('nicht beantwortet');
      });
    });

    test('passes when enough answers are right', async () => {
      await examPage.setCount(2);
      await examPage.start();

      for (const position of [1, 2]) {
        await test.step(`answer question ${position} right`, async () => {
          await expect(examPage.progress).toHaveText(`Frage ${position} von 2`);
          const word = (await examPage.word.textContent()) ?? '';

          await examPage.answer(SOLUTIONS.get(word) ?? '');
        });
      }

      await expect(examPage.verdict).toHaveText('Bestanden');
      await expect(examPage.mistakes).toHaveCount(0);
    });

    test('checks the number of words and shows the pass mark', async () => {
      await test.step('reject more words than there are', async () => {
        await examPage.setCount(SAMPLE_COUNT + 1);
        await examPage.start();

        await expect(examPage.errors).toHaveText([`Höchstens ${SAMPLE_COUNT} Wörter.`]);
        await expect(examPage.progress).toBeHidden();
      });

      await test.step('lower "Nötige Trefferquote" to the minimum', async () => {
        await examPage.setCount(3);
        await expect(examPage.passHint).toHaveText('Bestanden ab 3 von 3 richtigen Antworten.');

        await examPage.passRateSlider.press('Home');

        await expect(examPage.passHint).toHaveText('Bestanden ab 1 von 3 richtigen Antworten.');
      });
    });

    test('locks "Erfassen" and "Trainieren" until the exam is cancelled', async () => {
      await examPage.start();

      await test.step('tabs are locked, going back stays in the exam', async () => {
        await expect(appShell.tab('Erfassen')).toBeDisabled();
        await expect(appShell.tab('Trainieren')).toBeDisabled();

        await examPage.page.goBack();

        await expect(examPage.progress).toHaveText(`Frage 1 von ${SAMPLE_COUNT}`);
      });

      await test.step('keep going after "Weiter prüfen"', async () => {
        await examPage.cancel();
        await examPage.cancelDialog.confirm('Weiter prüfen');

        await expect(examPage.progress).toBeVisible();
      });

      await test.step('cancel and unlock the tabs', async () => {
        await examPage.cancel();
        await examPage.cancelDialog.confirm('Abbrechen');

        await expect(examPage.countInput).toBeVisible();
        await expect(appShell.tab('Erfassen')).toBeEnabled();
      });
    });
  });
});
