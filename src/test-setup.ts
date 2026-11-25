// The word list is saved to localStorage, which would otherwise leak from one test into the next.
beforeEach(() => localStorage.clear());

// Spies on globals (Math.random, Date.now, console, Storage) must not outlive their test.
afterEach(() => vi.restoreAllMocks());
