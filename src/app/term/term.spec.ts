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
});
