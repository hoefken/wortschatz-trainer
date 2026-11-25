import { InjectionToken } from '@angular/core';

/**
 * Wie oft die Abfragerichtung zufällig gewählt wird.
 *
 * - `per-question`: bei jeder Frage neu.
 * - `per-session`: einmal pro Prüfung bzw. einmal pro Training (bis die Seite neu geladen wird)
 */
export type QuestionDirection = 'per-question' | 'per-session';

/**
 * Legt beim Bauen fest, wie Training und Prüfung die Abfragerichtung wählen.
 *
 * Die Anforderung „Es wird zufällig die eine oder andere Sprache abgefragt“ ist unklar: Sie
 * kann eine zufällige Richtung pro Frage meinen oder eine, die einmal zu Beginn zufällig
 * gewählt wird. Standard ist `per-question`; die andere Lesart lässt sich in `app.config.ts`
 * mit `{ provide: QUESTION_DIRECTION, useValue: 'per-session' }` einstellen.
 */
export const QUESTION_DIRECTION = new InjectionToken<QuestionDirection>('QUESTION_DIRECTION', {
  factory: () => 'per-question',
});

/**
 * Liefert eine Funktion, die für jede Frage angibt, ob sie umgekehrt abgefragt wird.
 * Bei `per-session` wird nur einmal gewürfelt, beim Aufruf dieser Funktion.
 */
export function directionPicker(direction: QuestionDirection): () => boolean {
  if (direction === 'per-question') {
    return () => Math.random() >= 0.5;
  }
  const reversed = Math.random() >= 0.5;
  return () => reversed;
}
