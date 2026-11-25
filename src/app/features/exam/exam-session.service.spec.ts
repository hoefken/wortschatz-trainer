import { TestBed } from '@angular/core/testing';
import { QUESTION_DIRECTION } from '../../shared/question-direction';
import { TermService } from '../../term/term.service';
import { ExamSession, requiredCorrect } from './exam-session.service';

describe('ExamSession', () => {
  let terms: TermService;
  let session: ExamSession;
  let random: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    random = vi.spyOn(Math, 'random').mockReturnValue(0);
    terms = TestBed.inject(TermService);
    session = TestBed.inject(ExamSession);
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });
    terms.add({ source: 'Zeit', target: 'time' });
  });

  function answerAll(answer: (solution: string, index: number) => string): string[] {
    const asked: string[] = [];
    for (let question = session.question(); question; question = session.question()) {
      session.answer(answer(question.solution, asked.length));
      asked.push(question.word);
    }
    return asked;
  }

  it('is not running before the start', () => {
    expect(session.running()).toBe(false);
    expect(session.question()).toBeUndefined();
    expect(session.result()).toBeUndefined();
  });

  it('asks every word pair exactly once', () => {
    session.start({ limit: 3, passRate: 80 });

    expect(session.running()).toBe(true);
    expect(answerAll(solution => solution).sort()).toEqual(['Baum', 'Haus', 'Zeit']);
  });

  it('asks only the chosen number of words', () => {
    session.start({ limit: 2, passRate: 80 });

    expect(session.total()).toBe(2);
    expect(answerAll(solution => solution)).toHaveLength(2);
  });

  it('asks from the target language when the direction roll is high', () => {
    random.mockReturnValue(0.7);
    session.start({ limit: 3, passRate: 80 });

    expect(session.question()?.from).toBe(terms.targetLanguage);
  });

  it('counts the position and stops after the last answer', () => {
    session.start({ limit: 3, passRate: 80 });
    session.answer('x');

    expect(session.position()).toBe(2);

    answerAll(() => 'x');

    expect(session.running()).toBe(false);
    expect(session.question()).toBeUndefined();
  });

  it('reports the result of a passed exam, matching answers ignoring case and spaces', () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1_000).mockReturnValueOnce(162_000);
    session.start({ limit: 3, passRate: 60 });
    answerAll((solution, index) => (index < 2 ? ` ${solution.toUpperCase()} ` : ''));

    expect(session.result()).toEqual({
      total: 3,
      correct: 2,
      wrong: 1,
      rate: 67,
      passRate: 60,
      passed: true,
      mistakes: [expect.objectContaining({ answer: '', correct: false })],
      durationMs: 161_000,
    });
  });

  it('fails below the pass rate', () => {
    session.start({ limit: 3, passRate: 80 });
    answerAll((solution, index) => (index < 2 ? solution : 'x'));

    expect(session.result()?.passed).toBe(false);
  });

  it('goes back to the settings on reset', () => {
    session.start({ limit: 3, passRate: 80 });
    session.reset();

    expect(session.running()).toBe(false);
    expect(session.result()).toBeUndefined();
  });
});

describe('requiredCorrect', () => {
  it('rounds the required number of right answers up', () => {
    expect(requiredCorrect(9, 80)).toBe(8);
  });

  it('keeps an exact pass mark despite floating point', () => {
    // 0.7 * 10 is 7.000000000000001, which would round up to 8.
    expect(requiredCorrect(10, 70)).toBe(7);
  });
});

describe('ExamSession with one direction per session', () => {
  it('asks every question in the direction rolled at the start', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.7).mockReturnValue(0);
    TestBed.configureTestingModule({
      providers: [{ provide: QUESTION_DIRECTION, useValue: 'per-session' }],
    });
    const terms = TestBed.inject(TermService);
    const session = TestBed.inject(ExamSession);
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });

    session.start({ limit: 2, passRate: 80 });

    expect(session.question()?.from).toBe(terms.targetLanguage);
    session.answer('x');
    expect(session.question()?.from).toBe(terms.targetLanguage);
  });
});
