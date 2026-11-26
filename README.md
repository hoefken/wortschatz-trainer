# Wortschatz-Trainer

A vocabulary trainer built with Angular 22.3 and Angular Material 3, organised in three tabs: Erfassen (manage word pairs), Trainieren (practice) and Prüfung (exam).

Live: https://hoefken.github.io/wortschatz-trainer/

## Quick start

Needs Node 24 (24.15 or newer) and npm 11.

```bash
npm ci
npm start
```

The app then runs at `http://localhost:4200`.

| Command                                   | What it does                                                       |
| ----------------------------------------- | ------------------------------------------------------------------ |
| `npm run lint`                            | ESLint for TypeScript and templates, including accessibility rules |
| `npm test`                                | unit tests in watch mode                                           |
| `npm run test-ci`                         | unit tests, one run                                                |
| `npm run build`                           | production build to `dist/`                                        |
| `npx playwright install chromium firefox` | downloads the two browsers, needed once before the e2e tests       |
| `npm run e2e`                             | e2e tests, starts the dev server itself or reuses a running one    |

## Features

Every requirement and bonus of the assignment is built except one, the time limit for the exam.

**Erfassen**

- Word pairs in a table, sorted alphabetically with the rules of the column's language.
- Add and edit in a dialog. Both words are required, and a word that is already in the list is rejected, ignoring case.
- Delete with a confirmation.
- "Beispieldaten einfügen" adds nine sample word pairs and skips the ones already in the list.
- "Alles zurücksetzen" clears the list after a confirmation.
- Bonus: the table sorts by either language.
- Bonus: the word list is saved in LocalStorage.

**Trainieren**

- Each question picks a random word pair and a random direction. The same pair never comes twice in a row.
- A right answer is confirmed, a wrong answer shows the correct word.
- A score counts right and wrong answers until the page is reloaded.
- Bonus: wrongly answered words come back more often.

**Prüfung**

- "Erfassen" and "Trainieren" are locked while an exam runs.
- Every chosen word is asked once, in random order and direction, without feedback per answer.
- The result shows passed or failed, the hit rate, right and wrong answers, the time taken and each mistake with the correct word.
- An exam can be cancelled after a confirmation.
- Bonus: the number of words and the required hit rate can be set before the start.

## Assumptions

The assignment leaves these points open. This is how the app reads them.

- **Languages.** The assignment speaks of word pairs and "beide Sprachen" and names no language. The app uses Deutsch and Englisch.
- **Question direction.** "Es wird zufällig die eine oder andere Sprache abgefragt" can mean a random direction for each question or one random direction for a whole training or exam. The app rolls for each question. `{ provide: QUESTION_DIRECTION, useValue: 'per-session' }` in `app.config.ts` switches to the other reading.
- **Right answers.** An answer is right when it equals the stored word, ignoring case and surrounding spaces. Each word has one accepted answer. In an exam an empty answer counts as wrong, in training the form asks for an answer first.
- **Duplicates.** A German word can be in the list once. Two German words may share the same English word.
- **Sort order.** The list starts sorted by the German word, ascending.
- **Passing an exam.** The required hit rate starts at 80 % and can be set from 10 to 100 %. The number of right answers it stands for is rounded up.

## Architecture

```
src/app/
  layout/         page frame and tab bar: Layout, NavBar
  features/
    vocabulary/   Erfassen: word pair table, add/edit dialog
    training/     Trainieren: view and TrainingSession
    exam/         Prüfung: setup, question, summary, ExamSession, route guard
  shared/         models used by several features (Language, WordPair, Question),
                  QuestionPrompt, confirm dialog, LocalStorageService
  term/           the data source: Term, TermService, sample data
```

The three sections are lazy routes. A feature imports from `term/` and `shared/` and never from another feature. The only import into a feature from outside the routes is `NavBar` in `layout/`, which reads `ExamSession` for the exam lock.

**Domain model.** `Term` is an immutable class that stores translations keyed by language code. The UI never sees it. `TermService` projects each term onto the source and target language as a `WordPair` (`id`, `source`, `target`) that can be turned into a `Question`. The model is usable for more than one language pair and is serializable.

**State.** Three singleton services hold the state in signals. Each keeps its signals private and exposes `computed` values and a few methods. Components render the values and call the methods. The only state in components is form input and the table sort.

**Object orientation.** Classes are used where state or rules need an owner. That is `Term` with its factories (`create`, `fromStored`) and the three state services. Data that only travels to the templates (`WordPair`, `Question`, `ExamResult`) is a read-only interface, built by a function such as `toQuestion`. Each of them is created in at most two places, so turning one into a class later is a small change.

**Persistence.** `LocalStorageService` is the only code that touches `localStorage`, and `TermService` is its only caller. `TermService` loads the terms once at start and saves them in an `effect`, so no mutating method can forget to save. `LocalStorageService` catches storage errors, so the app keeps working in memory when storage is blocked or full. `Term.fromStored` checks the shape of each stored entry instead of casting it and drops invalid ones. The stored format is the language-neutral `Term` under the versioned key `wortschatz-trainer.terms.v1`, so translations in other languages survive and a format change gets a new key instead of migration code.

**Exam lock.** `ExamSession.running` drives the `lockedDuringExam` guard on the two other routes and the disabled tabs in `NavBar`. The guard also covers the ways around the tabs, a typed URL and the browser's back button. A lock icon marks the disabled tabs, and a tooltip names the reason, also for screen readers.

## Decisions

- **No persistence layer.** My first plan had an async repository, DTOs and schema migrations to prepare for a backend. I cut it because nothing in the assignment needs it. What stays from that plan is the data shape, client-generated UUIDs and the versioned storage key. The cost is that a backend would replace `LocalStorageService` and make loading in `TermService` asynchronous.
- **No `LanguagePair` class.** The app uses one fixed pair. It is two fields on `TermService`, the only place that defines it, so a pair picker would be a UI extension without a model change.
- **No state library.** The requirements do not call for one, and I did not want to over-engineer a small app. The state is one word list and two sessions.
- **Sessions are app-wide services.** The training score and the current question survive a tab switch, and the guard and the tab bar need the exam state. Sessions are not persisted, so a reload ends a running exam and lifts the lock.
- **Signal Forms.** They are my preferred way to write forms, simpler and more flexible than template-driven or reactive forms, and stable since Angular 22.
- **A ticket pool for missed words.** Each wrong answer adds an extra ticket for its word pair to the draw and each right answer removes one, so a word missed twice needs two right answers before it comes up at the normal rate again. A weighted pick with a cumulative sum gave the same odds with more code.
- **File names with type suffix, class names mostly without.** Files keep the 2016 naming (`.component.ts`, `.service.ts`, `.guard.ts`) so a file name states its role. A component that is opened through `MatDialog` and never placed in a template is named `.dialog.ts` for the same reason. Classes follow the Angular 22 default (`Exam`, `TrainingSession`). A class keeps a suffix where the plain name was already taken or where it reads better, as in `TermService` (the model is called `Term`), `LocalStorageService`, `WordPairDialog`, `ConfirmDialog` and `DurationPipe`. An area's main component sits in the area folder, each child component in its own subfolder.
- **No third-party requests at runtime.** Roboto is bundled as the Latin subset in weights 400 and 500, the only weights the M3 type scale uses. The twelve icons in use are imported as SVG text at build time, so there is no icon font.
- **`autoCsp`, although experimental in CLI 22.3.** It is an easy win. One option in `angular.json` adds a hash-based strict CSP to production builds without extra code. It looked stable in this project, and the production build shows no CSP violations. It does not apply to `ng serve`.
- **TypeScript target ES2023.** It matches the oldest browser in Angular's default support (Safari 17.0) and brings non-mutating array methods such as `toSpliced` for the signal state. `Intl.DurationFormat` needs ES2025, hence the small `DurationPipe`.

## Design

The UI follows a reference design made before implementation started. The screenshots are in [`docs/design/`](docs/design/), one per screen and state, at 1280 px desktop and 360 px mobile.

The app takes layout, spacing, type and states from the reference. Colors come from an M3 theme generated from the brand colors (`src/_theme-colors.scss`) and are used through `--mat-sys-*` roles only. During development the running app was compared with the screenshots at the artboard widths. Some states in the reference are not built (see [Future work](#future-work)).

## Tests and CI

**Unit tests** run in Vitest through `ng test`. They cover the domain logic and the services (`Term`, `TermService`, both sessions, `LocalStorageService`, `DurationPipe`) and, through the Angular Material test harnesses, the dialog, the table and the tab bar. Tests that depend on chance spy on `Math.random` and set the rolls. A global setup clears `localStorage` before each test and restores all spies after it.

**E2E tests** run in Playwright against Chromium and Firefox and cover the main flow of each tab. They follow a Page Object Model with one base fixture. Each functional step is a `test.step`, so the report reads like the test case. One layout check runs at 360, 1280, 1920 and 3440 px.

**CI.** `ci.yml` is groundwork and is started by hand (see [Future work](#future-work)). It runs lint, the unit tests, a production build and the e2e tests in both browsers, and uploads the Playwright report when a run fails. `deploy.yml` is also started by hand. It builds the app for GitHub Pages and copies `index.html` to `404.html` so deep links work. A pre-commit hook runs ESLint and Prettier on the staged files.

## Future work

- **Exam time limit.** The reference design already shows the last minute and a time-out result.
- **Inline add form.** The reference design adds word pairs in a form above the table. Today adding and editing go through the dialog.
- **Mobile layout and snackbars for Erfassen.** The reference design has a 360 px layout for the list and confirms "Beispieldaten einfügen" and "Alles zurücksetzen" with a snackbar.
- **Language pair picker.** See "No `LanguagePair` class" under [Decisions](#decisions).
- **Several accepted answers.** A word like "Schlüssel" has more than one translation. Today each word has one.
- **Persisted sessions**, so a running exam and the training score survive a reload.
- **CI on every push.** `ci.yml` holds the full pipeline and only lacks the `push` and `pull_request` triggers.
- **Sync between browser tabs.** A second tab only sees changes after a reload. The `storage` event would close that gap.
- **Injected random source.** The sessions call `Math.random()` directly, and unit tests spy on it. An `InjectionToken` for the random source would make the dependency explicit through `inject()` and let tests provide a fixed sequence instead of patching a global.

## AI support

I built this project with Claude Code (Anthropic) and used it for the reference design, research on the Angular 22 APIs, the project setup, writing code and tests from designs I approved, a readability review, and the test and browser runs. The references the AI worked from are in the repo: the skills in [`.claude/skills/`](.claude/skills/) and the reference design in [`docs/design/`](docs/design/).

The scope, the architecture and the conventions are my decisions. The reasons are under [Architecture](#architecture) and [Decisions](#decisions). The commit messages are AI-generated. The commits carry no AI attribution because each one is a change I reviewed and approved.
