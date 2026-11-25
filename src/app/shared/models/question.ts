import { Language } from './language';
import { WordPair } from './word-pair';

export interface Question {
  readonly word: string;
  readonly solution: string;
  readonly from: Language;
  readonly to: Language;
}

export function toQuestion(
  { source, target }: WordPair,
  sourceLanguage: Language,
  targetLanguage: Language,
  reversed?: boolean,
): Question {
  return reversed
    ? { word: target, solution: source, from: targetLanguage, to: sourceLanguage }
    : { word: source, solution: target, from: sourceLanguage, to: targetLanguage };
}
