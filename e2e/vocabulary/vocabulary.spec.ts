import { expect } from '@playwright/test';
import { fixtureBase } from '../util/fixture-base';
import { VocabularyPage } from './pageobjects/vocabulary-page';
import { WordPairDialog } from './pageobjects/word-pair-dialog';
import { WordPairTable } from './pageobjects/word-pair-table';

const test = fixtureBase;

// Not part of the sample data, so it never collides with it.
const WORD_PAIR = { source: 'Bahnhof', target: 'station' };

test.describe('Section "Erfassen"', () => {
  let vocabularyPage: VocabularyPage;
  let table: WordPairTable;
  let wordPairDialog: WordPairDialog;

  test.beforeEach(async ({ vocabularyPage: page }) => {
    vocabularyPage = page;
    table = page.table;
    wordPairDialog = page.wordPairDialog;
  });

  test('adds, edits and deletes a word pair', async () => {
    await test.step('add a word pair', async () => {
      await vocabularyPage.addWordPair(WORD_PAIR.source, WORD_PAIR.target);

      await expect(table.row(WORD_PAIR.source)).toContainText(WORD_PAIR.target);
      await expect(vocabularyPage.count).toHaveText('1 Wortpaar');
    });

    await test.step('edit its translation', async () => {
      await vocabularyPage.editWordPair(WORD_PAIR.source, 'train station');

      await expect(table.row(WORD_PAIR.source)).toContainText('train station');
    });

    await test.step('delete it', async () => {
      await vocabularyPage.deleteWordPair(WORD_PAIR.source);

      await expect(vocabularyPage.emptyState).toBeVisible();
    });
  });

  test('rejects a word that is already in the list, ignoring case', async () => {
    await vocabularyPage.addSamples();

    await test.step('try to add "haus" next to the sample word "Haus"', async () => {
      await vocabularyPage.addWordPair('haus', 'home');

      await expect(wordPairDialog.errors).toHaveText(['Dieses Wort ist bereits erfasst.']);
      await expect(vocabularyPage.count).toHaveText('9 Wortpaare');
    });
  });

  test('sorts by either language', async () => {
    await vocabularyPage.addSamples();

    await test.step('"Deutsch" ascending by default', async () => {
      await expect(table.column(0).first()).toHaveText('Apfel');
      await expect(table.column(0).last()).toHaveText('Zeit');
    });

    await test.step('"Englisch" ascending after sorting by it', async () => {
      await table.sortBy('Englisch');

      await expect(table.column(1).first()).toHaveText('apple');
      await expect(table.column(1).last()).toHaveText('window');
    });
  });

  test('inserts "Beispieldaten" only once and resets everything', async () => {
    await test.step('insert "Beispieldaten"', async () => {
      await vocabularyPage.addSamples();

      await expect(vocabularyPage.count).toHaveText('9 Wortpaare');
      await expect(vocabularyPage.samplesButton).toBeDisabled();
    });

    await test.step('reset everything', async () => {
      await vocabularyPage.resetAll();

      await expect(vocabularyPage.count).toHaveText('0 Wortpaare');
    });
  });

  for (const viewport of [
    { width: 360, height: 800 },
    { width: 1280, height: 900 },
    { width: 1920, height: 1080 },
    { width: 3440, height: 1440 },
  ]) {
    test.describe(`at ${viewport.width} px`, () => {
      test.use({ viewport });

      test('shows both row actions uncut', async () => {
        await vocabularyPage.addSamples();

        for (const button of [table.editButton('Apfel'), table.deleteButton('Apfel')]) {
          await expect(button.locator('svg')).toBeInViewport({ ratio: 1 });
        }
        for (const cell of await table.actionCells.all()) {
          expect(await cell.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(
            true,
          );
        }
      });
    });
  }
});
