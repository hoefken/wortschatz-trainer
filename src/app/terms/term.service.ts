import { computed, Service, signal } from '@angular/core';
import { Language } from './language';
import { isSameWord } from './same-word';
import { SAMPLE_TERMS } from './sample-terms';
import { Term, Translations } from './term';
import { UnsavedWordPair, WordPair } from './word-pair';

@Service()
export class TermService {
  readonly sourceLanguage: Language = { code: 'de', name: 'Deutsch' };
  readonly targetLanguage: Language = { code: 'en', name: 'Englisch' };

  private readonly terms = signal<readonly Term[]>([]);

  readonly wordPairs = computed<readonly WordPair[]>(() =>
    this.terms().flatMap(
      term => term.toWordPair(this.sourceLanguage.code, this.targetLanguage.code) ?? [],
    ),
  );

  readonly canAddSamples = computed(() => this.missingSamples().length > 0);

  private readonly missingSamples = computed(() =>
    SAMPLE_TERMS.filter(
      translations => !this.isDuplicate(translations[this.sourceLanguage.code] ?? ''),
    ),
  );

  add(words: UnsavedWordPair): void {
    this.terms.update(terms => [...terms, Term.create(this.toTranslations(words))]);
  }

  addSamples(): void {
    const missing = this.missingSamples();
    this.terms.update(terms => [
      ...terms,
      ...missing.map(translations => Term.create(translations)),
    ]);
  }

  update({ id, ...words }: WordPair): void {
    this.terms.update(terms =>
      terms.map(term =>
        term.id === id ? term.withTranslations(this.toTranslations(words)) : term,
      ),
    );
  }

  remove(id: string): void {
    this.terms.update(terms => terms.filter(term => term.id !== id));
  }

  reset(): void {
    this.terms.set([]);
  }

  isDuplicate(source: string, exceptId?: string): boolean {
    return this.wordPairs().some(pair => pair.id !== exceptId && isSameWord(pair.source, source));
  }

  private toTranslations({ source, target }: UnsavedWordPair): Translations {
    return {
      [this.sourceLanguage.code]: source.trim(),
      [this.targetLanguage.code]: target.trim(),
    };
  }
}
