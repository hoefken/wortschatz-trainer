export function isSameWord(first: string, second: string): boolean {
  return normalize(first) === normalize(second);
}

function normalize(word: string): string {
  return word.trim().toLocaleLowerCase();
}
