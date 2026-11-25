import { computed, inject, linkedSignal, Service, signal } from '@angular/core';
import { Question, toQuestion } from '../../terms/question';
import { isSameWord } from '../../terms/same-word';
import { TermService } from '../../terms/term.service';
import { WordPair } from '../../terms/word-pair';

export interface Result {
  readonly answer: string;
  readonly correct: boolean;
}

export interface Score {
  readonly correct: number;
  readonly wrong: number;
}

interface Round {
  readonly pairId: string;
  readonly reversed: boolean;
  readonly result?: Result;
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

  readonly result = computed(() => this.round()?.result);
  readonly score = computed(() => this.tally());

  private readonly terms = inject(TermService);
  private readonly tally = signal<Score>({ correct: 0, wrong: 0 });

  // Keeps the current round while its word pair exists; starts a new one when the
  // pair was deleted or the first pairs arrive.
  private readonly round = linkedSignal<readonly WordPair[], Round | undefined>({
    source: this.terms.wordPairs,
    computation: (pairs, previous) => {
      const current = previous?.value;
      return current && pairs.some(({ id }) => id === current.pairId)
        ? current
        : randomRound(pairs);
    },
  });

  check(answer: string): void {
    const round = this.round();
    const question = this.question();
    if (!round || !question || round.result) {
      return;
    }
    const correct = isSameWord(answer, question.solution);
    this.round.set({ ...round, result: { answer: answer.trim(), correct } });
    this.tally.update(score =>
      correct ? { ...score, correct: score.correct + 1 } : { ...score, wrong: score.wrong + 1 },
    );
  }

  next(): void {
    this.round.set(randomRound(this.terms.wordPairs(), this.round()?.pairId));
  }
}

function randomRound(pairs: readonly WordPair[], previousId?: string): Round | undefined {
  const candidates = pairs.length > 1 ? pairs.filter(({ id }) => id !== previousId) : pairs;
  if (candidates.length === 0) {
    return undefined;
  }
  const pair = candidates[Math.floor(Math.random() * candidates.length)];
  return { pairId: pair.id, reversed: Math.random() >= 0.5 };
}
