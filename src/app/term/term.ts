import { LanguageCode } from '../shared/models/language';
import { WordPair } from '../shared/models/word-pair';

export type Translations = Readonly<Record<LanguageCode, string>>;

export class Term {
  constructor(
    readonly id: string,
    readonly translations: Translations,
  ) {}

  static create(translations: Translations): Term {
    return new Term(crypto.randomUUID(), translations);
  }

  // Stored data may be outdated or edited by hand, so it is checked instead of cast.
  static fromStored(value: unknown): Term | undefined {
    return isStoredTerm(value) ? new Term(value.id, value.translations) : undefined;
  }

  withTranslations(translations: Translations): Term {
    return new Term(this.id, { ...this.translations, ...translations });
  }

  toWordPair(sourceLanguage: LanguageCode, targetLanguage: LanguageCode): WordPair | undefined {
    const source = this.translations[sourceLanguage];
    const target = this.translations[targetLanguage];
    return source === undefined || target === undefined
      ? undefined
      : { id: this.id, source, target };
  }
}

function isStoredTerm(value: unknown): value is Pick<Term, 'id' | 'translations'> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'translations' in value &&
    typeof value.translations === 'object' &&
    value.translations !== null &&
    Object.values(value.translations).every(word => typeof word === 'string')
  );
}
