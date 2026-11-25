import { computed, inject, linkedSignal, Service, signal } from '@angular/core';
import { Question, toQuestion } from '../../shared/models/question';
import { directionPicker, QUESTION_DIRECTION } from '../../shared/question-direction';
import { isSameWord } from '../../term/is-same-word';
import { TermService } from '../../term/term.service';
import { WordPair } from '../../shared/models/word-pair';

export interface TrainingAnswer {
  readonly answer: string;
  readonly correct: boolean;
}

export interface TrainingScore {
  readonly correct: number;
  readonly wrong: number;
}

interface Round {
  readonly pairId: string;
  readonly reversed: boolean;
  readonly checkedAnswer?: TrainingAnswer;
}

@Service()
export class TrainingSession {
  readonly question = computed<Question | undefined>(() => {
    const round = this.round();
    const pair = this.terms.wordPairs().find(({ id }) => id === round?.pairId);
    if (!round || !pair) {
      return undefined;
    }
    return toQuestion(pair, this.terms.sourceLanguage, this.terms.targetLanguage, round.reversed);
  });

  readonly checkedAnswer = computed(() => this.round()?.checkedAnswer);
  readonly score = computed(() => this.tally());

  private readonly terms = inject(TermService);
  private readonly tally = signal<TrainingScore>({ correct: 0, wrong: 0 });

  // One entry per open miss: each adds an extra ticket for that word pair to the draw.
  private readonly missedPairIds = signal<readonly string[]>([]);
  private readonly nextReversed = directionPicker(inject(QUESTION_DIRECTION));

  // Keeps the current round while its word pair exists; starts a new one when the
  // pair was deleted or the first pairs arrive.
  private readonly round = linkedSignal<readonly WordPair[], Round | undefined>({
    source: this.terms.wordPairs,
    computation: (pairs, previous) => {
      const current = previous?.value;
      return current && pairs.some(({ id }) => id === current.pairId)
        ? current
        : randomRound(pairs, this.missedPairIds(), this.nextReversed);
    },
  });

  check(answer: string): void {
    const round = this.round();
    const question = this.question();
    if (!round || !question || round.checkedAnswer) {
      return;
    }
    const correct = isSameWord(answer, question.solution);
    this.round.set({ ...round, checkedAnswer: { answer: answer.trim(), correct } });
    if (correct) {
      this.tally.update(score => ({ ...score, correct: score.correct + 1 }));
      this.missedPairIds.update(ids => removeFirst(ids, round.pairId));
    } else {
      this.tally.update(score => ({ ...score, wrong: score.wrong + 1 }));
      this.missedPairIds.update(ids => [...ids, round.pairId]);
    }
  }

  next(): void {
    this.round.set(
      randomRound(
        this.terms.wordPairs(),
        this.missedPairIds(),
        this.nextReversed,
        this.round()?.pairId,
      ),
    );
  }
}

function randomRound(
  pairs: readonly WordPair[],
  missedPairIds: readonly string[],
  nextReversed: () => boolean,
  previousId?: string,
): Round | undefined {
  // A missed pair that was deleted in the meantime finds nothing and drops out.
  const extraTickets = missedPairIds.flatMap(id => pairs.find(pair => pair.id === id) ?? []);
  const tickets = [...pairs, ...extraTickets];
  const candidates = pairs.length > 1 ? tickets.filter(({ id }) => id !== previousId) : tickets;
  if (candidates.length === 0) {
    return undefined;
  }
  const pair = candidates[Math.floor(Math.random() * candidates.length)];
  return { pairId: pair.id, reversed: nextReversed() };
}

function removeFirst(ids: readonly string[], id: string): readonly string[] {
  const index = ids.indexOf(id);
  return index < 0 ? ids : ids.toSpliced(index, 1);
}
