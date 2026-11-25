import { Service } from '@angular/core';

// Storage can be blocked (privacy settings) or full; the app then keeps working in memory.
@Service()
export class LocalStorageService {
  read(key: string): unknown {
    try {
      const json = localStorage.getItem(key);
      return json === null ? undefined : JSON.parse(json);
    } catch (error) {
      console.warn(`Could not read "${key}" from localStorage.`, error);
      return undefined;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not write "${key}" to localStorage.`, error);
    }
  }
}
