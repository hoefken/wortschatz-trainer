import { WordPair } from './word-pair';

export type Translations = Readonly<Record<string, string>>;

export class Term {
  constructor(
    readonly id: string,
    readonly translations: Translations,
  ) {}

  static create(translations: Translations): Term {
    return new Term(crypto.randomUUID(), translations);
  }

  withTranslations(translations: Translations): Term {
    return new Term(this.id, { ...this.translations, ...translations });
  }

  toWordPair(sourceLanguage: string, targetLanguage: string): WordPair | undefined {
    const source = this.translations[sourceLanguage];
    const target = this.translations[targetLanguage];
    return source === undefined || target === undefined
      ? undefined
      : { id: this.id, source, target };
  }
}
