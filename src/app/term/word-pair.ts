export interface WordPair {
  readonly id: string;
  readonly source: string;
  readonly target: string;
}

export type UnsavedWordPair = Omit<WordPair, 'id'>;
