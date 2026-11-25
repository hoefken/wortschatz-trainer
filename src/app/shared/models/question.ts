import { Language } from './language';
import { WordPair } from './word-pair';

export interface Question {
  readonly word: string;
  readonly solution: string;
  readonly from: Language;
  readonly to: Language;
}

/**
 * Macht aus einem Wortpaar eine Frage in einer der beiden Abfragerichtungen.
 *
 * @param pair - Das abgefragte Wortpaar.
 * @param sourceLanguage - Sprache Von.
 * @param targetLanguage - Sprache Zu.
 * @param reversed - Kehrt die Abfragerichtung um. Standard: von der
 *   Ausgangs- in die Zielsprache (`source` wird gezeigt, `target` erwartet).
 */
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
