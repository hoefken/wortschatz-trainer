import { computed, Service, signal } from '@angular/core';
import { Term, Translations } from './term';
import { UnsavedWordPair, WordPair } from './word-pair';

@Service()
export class TermService {
  readonly sourceLanguage = { code: 'de', name: 'Deutsch' };
  readonly targetLanguage = { code: 'en', name: 'Englisch' };
  private readonly terms = signal<readonly Term[]>([]);

  readonly wordPairs = computed<readonly WordPair[]>(() =>
    this.terms().flatMap(
      term => term.toWordPair(this.sourceLanguage.code, this.targetLanguage.code) ?? [],
    ),
  );

  add(words: UnsavedWordPair): void {
    this.terms.update(terms => [...terms, Term.create(this.toTranslations(words))]);
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

  private toTranslations({ source, target }: UnsavedWordPair): Translations {
    return { [this.sourceLanguage.code]: source, [this.targetLanguage.code]: target };
  }
}
