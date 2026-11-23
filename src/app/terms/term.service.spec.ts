import { TestBed } from '@angular/core/testing';
import { TermService } from './term.service';

describe('TermService', () => {
  let service: TermService;

  beforeEach(() => {
    service = TestBed.inject(TermService);
  });

  it('starts without word pairs in the default language pair', () => {
    expect(service.sourceLanguage.code).toBe('de');
    expect(service.targetLanguage.code).toBe('en');
    expect(service.wordPairs()).toEqual([]);
  });

  it('adds a word pair', () => {
    service.add({ source: 'Haus', target: 'house' });

    expect(service.wordPairs()).toEqual([
      { id: expect.any(String), source: 'Haus', target: 'house' },
    ]);
  });

  it('updates a word pair', () => {
    service.add({ source: 'Haus', target: 'house' });
    const [{ id }] = service.wordPairs();

    service.update({ id, source: 'Gebäude', target: 'building' });

    expect(service.wordPairs()).toEqual([{ id, source: 'Gebäude', target: 'building' }]);
  });

  it('removes a word pair', () => {
    service.add({ source: 'Haus', target: 'house' });
    service.add({ source: 'Baum', target: 'tree' });
    const [house, tree] = service.wordPairs();

    service.remove(house.id);

    expect(service.wordPairs()).toEqual([tree]);
  });

  it('resets all word pairs', () => {
    service.add({ source: 'Haus', target: 'house' });

    service.reset();

    expect(service.wordPairs()).toEqual([]);
  });

  it('trims words before storing them', () => {
    service.add({ source: ' Haus ', target: 'house  ' });

    expect(service.wordPairs()[0]).toMatchObject({ source: 'Haus', target: 'house' });
  });

  it('adds only sample words that are not yet in the list', () => {
    service.add({ source: 'haus', target: 'home' });

    service.addSamples();
    const countAfterFirstFill = service.wordPairs().length;
    service.addSamples();

    expect(service.wordPairs().filter(pair => pair.source.toLowerCase() === 'haus')).toHaveLength(
      1,
    );
    expect(service.wordPairs()).toHaveLength(countAfterFirstFill);
  });

  it('can add samples only while at least one sample word is missing, edited ones count as present', () => {
    expect(service.canAddSamples()).toBe(true);

    service.addSamples();
    expect(service.canAddSamples()).toBe(false);

    const haus = service.wordPairs().find(pair => pair.source === 'Haus')!;
    service.update({ ...haus, target: 'home' });
    expect(service.canAddSamples()).toBe(false);

    service.remove(haus.id);
    expect(service.canAddSamples()).toBe(true);
  });

  it('detects duplicates ignoring case and surrounding spaces, except the pair itself', () => {
    service.add({ source: 'Haus', target: 'house' });
    const [{ id }] = service.wordPairs();

    expect(service.isDuplicate(' haus ')).toBe(true);
    expect(service.isDuplicate('Haus', id)).toBe(false);
    expect(service.isDuplicate('Baum')).toBe(false);
  });
});
