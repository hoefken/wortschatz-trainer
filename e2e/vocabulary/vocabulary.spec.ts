import { expect } from '@playwright/test';
import { fixtureBase } from '../util/fixture-base';
import { SAMPLE_COUNT } from '../util/sample-words';
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
      await expect(vocabularyPage.count).toHaveText(`${SAMPLE_COUNT} Wortpaare`);
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

      await expect(vocabularyPage.count).toHaveText(`${SAMPLE_COUNT} Wortpaare`);
      await expect(vocabularyPage.samplesButton).toBeDisabled();
    });

    await test.step('reset everything', async () => {
      await vocabularyPage.resetAll();

      await expect(vocabularyPage.count).toHaveText('0 Wortpaare');
    });
  });

  test('keeps the word list after a reload', async ({ navigation }) => {
    await test.step('add a word pair', async () => {
      await vocabularyPage.addWordPair(WORD_PAIR.source, WORD_PAIR.target);

      await expect(vocabularyPage.count).toHaveText('1 Wortpaar');
    });

    await test.step('reload: the word pair is still there', async () => {
      await navigation.reload();

      await expect(table.row(WORD_PAIR.source)).toContainText(WORD_PAIR.target);
    });

    await test.step('reset everything', async () => {
      await vocabularyPage.resetAll();

      await expect(vocabularyPage.count).toHaveText('0 Wortpaare');
    });

    await test.step('reload: the list stays empty', async () => {
      await navigation.reload();

      await expect(vocabularyPage.emptyState).toBeVisible();
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

        await test.step('both icons of a row are fully in the viewport', async () => {
          await expect(table.actionIcons('Apfel')).toHaveCount(2);
          for (const icon of await table.actionIcons('Apfel').all()) {
            await expect(icon).toBeInViewport({ ratio: 1 });
          }
        });

        await test.step('no action cell clips its content', async () => {
          for (const cell of await table.actionCells.all()) {
            expect(await cell.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(
              true,
            );
          }
        });
      });
    });
  }
});
