// The word list is saved to localStorage, which would otherwise leak from one test into the next.
beforeEach(() => localStorage.clear());
