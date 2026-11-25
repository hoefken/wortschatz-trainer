import { computed, inject, Service, signal } from '@angular/core';
import { Question, toQuestion } from '../../shared/models/question';
import { directionPicker, QUESTION_DIRECTION } from '../../shared/question-direction';
import { isSameWord } from '../../term/is-same-word';
import { TermService } from '../../term/term.service';

export interface ExamSettings {
  readonly limit: number;
  readonly passRate: number;
}

export interface ExamAnswer {
  readonly question: Question;
  readonly answer: string;
  readonly correct: boolean;
}

export interface ExamResult {
  readonly total: number;
  readonly correct: number;
  readonly wrong: number;
  readonly rate: number;
  readonly passRate: number;
  readonly passed: boolean;
  readonly mistakes: readonly ExamAnswer[];
  readonly durationMs: number;
}

interface ExamAttempt {
  readonly questions: readonly Question[];
  readonly answers: readonly ExamAnswer[];
  readonly passRate: number;
  readonly startedAt: number;
  readonly finishedAt?: number;
}

@Service()
export class ExamSession {
  private readonly terms = inject(TermService);
  private readonly direction = inject(QUESTION_DIRECTION);
  private readonly exam = signal<ExamAttempt | undefined>(undefined);

  readonly running = computed(() => {
    const exam = this.exam();
    return exam !== undefined && exam.finishedAt === undefined;
  });

  readonly question = computed(() => {
    const exam = this.exam();
    return this.running() ? exam?.questions[exam.answers.length] : undefined;
  });

  readonly position = computed(() => (this.exam()?.answers.length ?? 0) + 1);
  readonly total = computed(() => this.exam()?.questions.length ?? 0);

  readonly result = computed<ExamResult | undefined>(() => {
    const exam = this.exam();
    if (exam?.finishedAt === undefined) {
      return undefined;
    }
    const { answers, passRate } = exam;
    const correct = answers.filter(answer => answer.correct).length;
    return {
      total: answers.length,
      correct,
      wrong: answers.length - correct,
      rate: Math.round((correct * 100) / answers.length),
      passRate,
      passed: correct >= requiredCorrect(answers.length, passRate),
      mistakes: answers.filter(answer => !answer.correct),
      durationMs: exam.finishedAt - exam.startedAt,
    };
  });

  start({ limit, passRate }: ExamSettings): void {
    const questions = this.generateQuestions(limit);
    this.exam.set({ questions, answers: [], passRate, startedAt: Date.now() });
  }

  answer(input: string): void {
    const exam = this.exam();
    const question = this.question();
    if (!exam || !question) {
      return;
    }
    const answers = [
      ...exam.answers,
      { question, answer: input.trim(), correct: isSameWord(input, question.solution) },
    ];
    const finished = answers.length === exam.questions.length;
    this.exam.set({ ...exam, answers, finishedAt: finished ? Date.now() : undefined });
  }

  reset(): void {
    this.exam.set(undefined);
  }

  private generateQuestions(limit: number): Question[] {
    const { sourceLanguage, targetLanguage } = this.terms;
    const nextReversed = directionPicker(this.direction);
    return this.terms
      .shuffledWordPairs()
      .slice(0, limit)
      .map(pair => toQuestion(pair, sourceLanguage, targetLanguage, nextReversed()));
  }
}

// Integer math first: 70 * 10 / 100 is exactly 7, while 0.7 * 10 is 7.000000000000001.
export function requiredCorrect(total: number, passRate: number): number {
  return Math.ceil((passRate * total) / 100);
}
