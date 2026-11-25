import { TestBed } from '@angular/core/testing';
import { QUESTION_DIRECTION } from '../../shared/question-direction';
import { TermService } from '../../term/term.service';
import { TrainingSession } from './training-session.service';

describe('TrainingSession', () => {
  let terms: TermService;
  let session: TrainingSession;
  let random: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    random = vi.spyOn(Math, 'random').mockReturnValue(0);
    terms = TestBed.inject(TermService);
    session = TestBed.inject(TrainingSession);
  });

  afterEach(() => {
    random.mockRestore();
  });

  it('has no question without word pairs', () => {
    expect(session.question()).toBeUndefined();
  });

  it('asks from the source language when the direction roll is low', () => {
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.2);
    terms.add({ source: 'Haus', target: 'house' });

    expect(session.question()).toEqual({
      word: 'Haus',
      solution: 'house',
      from: terms.sourceLanguage,
      to: terms.targetLanguage,
    });
  });

  it('asks from the target language when the direction roll is high', () => {
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.7);
    terms.add({ source: 'Haus', target: 'house' });

    expect(session.question()).toMatchObject({ word: 'house', solution: 'Haus' });
  });

  it('accepts an answer ignoring case and surrounding spaces', () => {
    terms.add({ source: 'Haus', target: 'house' });

    session.check('  HOUSE ');

    expect(session.result()).toEqual({ answer: 'HOUSE', correct: true });
    expect(session.score()).toEqual({ correct: 1, wrong: 0 });
  });

  it('rejects a wrong answer and counts it once', () => {
    terms.add({ source: 'Haus', target: 'house' });

    session.check('home');
    session.check('house');

    expect(session.result()).toEqual({ answer: 'home', correct: false });
    expect(session.score()).toEqual({ correct: 0, wrong: 1 });
  });

  it('never asks the same word pair twice in a row', () => {
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });
    expect(session.question()?.word).toBe('Haus');

    session.next();

    expect(session.question()?.word).toBe('Baum');
    expect(session.result()).toBeUndefined();
  });

  it('keeps asking the only word pair there is', () => {
    terms.add({ source: 'Haus', target: 'house' });

    session.next();

    expect(session.question()?.word).toBe('Haus');
  });

  it('asks a wrongly answered word pair more often', () => {
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });
    terms.add({ source: 'Katze', target: 'cat' });
    session.check('xyz');
    session.next();
    expect(session.question()?.word).toBe('Baum');

    // The draw is [Haus, Katze, Haus]; without the extra ticket, 0.7 would pick Katze.
    random.mockReturnValueOnce(0.7);
    session.next();

    expect(session.question()?.word).toBe('Haus');
  });

  it('lowers the weight again after a right answer', () => {
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });
    terms.add({ source: 'Katze', target: 'cat' });
    session.check('xyz');
    session.next();
    random.mockReturnValueOnce(0.7);
    session.next();
    session.check('house');
    session.next();
    expect(session.question()?.word).toBe('Baum');

    random.mockReturnValueOnce(0.7);
    session.next();

    expect(session.question()?.word).toBe('Katze');
  });

  it('shows an edited word pair in the current question', () => {
    terms.add({ source: 'Haus', target: 'house' });
    const [{ id }] = terms.wordPairs();

    terms.update({ id, source: 'Haus', target: 'home' });

    expect(session.question()?.solution).toBe('home');
  });

  it('moves on when the asked word pair is deleted', () => {
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });
    session.check('house');
    const [{ id }] = terms.wordPairs();

    terms.remove(id);

    expect(session.question()?.word).toBe('Baum');
    expect(session.result()).toBeUndefined();
    expect(session.score()).toEqual({ correct: 1, wrong: 0 });
  });
});

describe('TrainingSession with one direction per session', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the direction rolled at the start for every round', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.7).mockReturnValue(0);
    TestBed.configureTestingModule({
      providers: [{ provide: QUESTION_DIRECTION, useValue: 'per-session' }],
    });
    const terms = TestBed.inject(TermService);
    const session = TestBed.inject(TrainingSession);
    terms.add({ source: 'Haus', target: 'house' });
    terms.add({ source: 'Baum', target: 'tree' });

    expect(session.question()?.from).toBe(terms.targetLanguage);
    session.next();
    expect(session.question()?.from).toBe(terms.targetLanguage);
  });
});
