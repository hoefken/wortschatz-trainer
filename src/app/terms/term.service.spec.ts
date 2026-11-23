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
});
