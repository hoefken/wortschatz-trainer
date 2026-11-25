// The words behind "Beispieldaten", so a test can look up the answer in either direction.
const SAMPLE_WORDS = new Map([
  ['Apfel', 'apple'],
  ['Baum', 'tree'],
  ['Brücke', 'bridge'],
  ['Fenster', 'window'],
  ['Haus', 'house'],
  ['Katze', 'cat'],
  ['Schlüssel', 'key'],
  ['Wolke', 'cloud'],
  ['Zeit', 'time'],
]);

export const SAMPLE_COUNT = SAMPLE_WORDS.size;

// Not a translation of any sample word.
export const WRONG_ANSWER = 'xyz';

const SOLUTIONS = new Map([
  ...SAMPLE_WORDS,
  ...[...SAMPLE_WORDS].map(([de, en]) => [en, de] as const),
]);

export function solutionFor(word: string | null): string {
  return SOLUTIONS.get(word ?? '') ?? '';
}
