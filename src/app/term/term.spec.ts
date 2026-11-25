import { Term } from './term';

describe('Term', () => {
  const term = new Term('t1', { de: 'Haus', en: 'house', es: 'casa' });

  it('projects onto a word pair in the given direction', () => {
    expect(term.toWordPair('de', 'en')).toEqual({ id: 't1', source: 'Haus', target: 'house' });
    expect(term.toWordPair('es', 'de')).toEqual({ id: 't1', source: 'casa', target: 'Haus' });
  });

  it('has no word pair when a language is missing', () => {
    expect(term.toWordPair('de', 'fr')).toBeUndefined();
  });

  it('changes only the given translations and keeps its id', () => {
    const changed = term.withTranslations({ de: 'Gebäude', en: 'building' });

    expect(changed.id).toBe('t1');
    expect(changed.translations).toEqual({ de: 'Gebäude', en: 'building', es: 'casa' });
    expect(term.translations['de']).toBe('Haus');
  });

  it('gets a new unique id when created', () => {
    expect(Term.create({ de: 'Baum' }).id).not.toBe(Term.create({ de: 'Baum' }).id);
  });

  it('is restored from its stored form', () => {
    const stored = JSON.parse(JSON.stringify(term));

    expect(Term.fromStored(stored)).toEqual(term);
  });

  it('is not restored from data of another shape', () => {
    for (const value of [
      null,
      'Haus',
      { id: 't1' },
      { id: 1, translations: { de: 'Haus' } },
      { id: 't1', translations: { de: 42 } },
    ]) {
      expect(Term.fromStored(value)).toBeUndefined();
    }
  });
});
