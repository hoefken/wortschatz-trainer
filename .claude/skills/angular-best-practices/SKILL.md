---
name: angular-best-practices
description: Official Angular v22 best practices (angular.dev + angular/skills) plus workspace rules. Use whenever writing, generating, reviewing or refactoring Angular code in this workspace - components, templates, signals, linkedSignal, resource/httpResource, services/DI, Signal Forms, routing, SSR, accessibility, styling, testing (Vitest), Angular CLI or the Angular CLI MCP server.
---

# Angular Best Practices (Angular v22.3)

Target: Angular v22.3 (latest stable on 2026-11-22). Always check the project's real Angular
version first (`package.json`, `ng version`, or MCP `list_projects`) and adapt if it is older.

## Workspace rules (take precedence)

1. **MCP first.** When the Angular CLI MCP server is available, it is the primary source of truth:
   - Call `list_projects`, then `get_best_practices` with `workspacePath` before writing or changing
     Angular code. It returns the guide matching the installed framework version.
   - Use `search_documentation` for any API detail you are not sure about instead of memory.
   - `find_examples` is not part of Angular CLI 22.3.0 (no stable or experimental tool of that
     name). If a future CLI exposes it, use it for idiomatic code samples.
   - Without MCP, use this file, `references/official/`, and https://angular.dev.
2. **Check for newer 22.x APIs.** Before each task, read `references/angular-22-features.md` and
   decide whether a newer 22.x API fits better than the classic approach.
3. **Stable by default.** Prefer stable APIs. Use developer-preview or experimental APIs only on
   purpose, and record in the project README which API, its stability level, and why it was chosen.
   Known non-stable in v22.3: `resourceFromSnapshots` (experimental),
   `provideCheckNoChangesConfig` (developer preview), `ExperimentalIsolatedShadowDom` encapsulation.
4. **Self-explanatory code, no comments.** Express intent through names, small functions, types and
   structure. Do not add explanatory comments; rename or extract instead.
5. **Verify.** After generating code, run `ng build` (and `ng test`) and fix all errors before
   finishing. Via MCP use `run_target`.

## Official best practices (verbatim from angular.dev, v22)

Source: https://angular.dev/assets/context/best-practices.md (also returned by MCP `get_best_practices`).

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

### TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

### Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

### Services

- Design services around a single responsibility
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Condensed additions (angular.dev style guide, guides, and official `angular-developer` skill)

### Naming and structure (style guide)

- Hyphenated file names named after the main identifier (`user-profile.ts`); tests next to the code
  as `user-profile.spec.ts`. Component `.ts`, `.html`, `.css` share the base name.
- No generic files (`utils.ts`, `helpers.ts`, `common.ts`). One concept per file; prefer smaller files.
- Organize by feature, not by type (no `components/`, `services/` folders). UI code lives in `src/`,
  bootstrap in `src/main.ts`.
- New CLI naming (v20+, "intent over role"): no `.component`/`.service` suffixes; the class name
  states what it is (`UserProfile`, not `UserProfileComponent`). Details:
  `references/official/angular-developer/references/naming-conventions.md`.
- Directives use the app prefix and camelCase attribute selectors (`[appTooltip]`).

### Components and templates

- Group Angular members first: injected dependencies, inputs, outputs, queries; then methods.
- Mark template-only members `protected`; mark `input`, `model`, `output` and queries `readonly`.
- Use signal queries (`viewChild`, `viewChildren`, `contentChild`, `contentChildren`).
- Name event handlers after the action (`saveUser()`), not the event (`handleClick()`).
- Keep lifecycle hooks thin and implement their interfaces (`OnInit`).
- Do not build arrays/objects, filter or sort in templates; derive with `computed()` or a pure pipe.
- Use self-closing tags for components without content (`<app-user-card />`).
- `@for` always needs a meaningful `track` expression; use `@empty` for empty states.
- Use `@defer` with explicit triggers (`on viewport`, `on idle`, `on interaction`) plus
  `@placeholder`/`@loading` for heavy, below-the-fold UI. Only standalone dependencies are deferred.
- `@boundary` / `@error` (v22.2+) isolates render errors in a subtree; `$reset` retries.
- Prefer native CSS for animations (`animate.enter` / `animate.leave`) over the legacy DSL.

### Reactivity

- `signal()` for writable state, `computed()` for derived read-only state, `linkedSignal()` for
  writable state that resets/derives from a source (e.g. selected item that follows a list).
- Expose service state read-only: private `signal()`, public `.asReadonly()` or `computed()`.
- `effect()` only for syncing to non-signal APIs (storage, logging, canvas, third-party libs).
  Never `set`/`update` another signal inside an effect to propagate state.
- DOM work after render: `afterRenderEffect` with `earlyRead`/`write`/`read` phases.
- Use `untracked()` to read a signal without creating a dependency.
- Interop: `toSignal()` / `toObservable()` from `@angular/core/rxjs-interop`.

### Async data and HTTP

- Configure with `provideHttpClient(withInterceptors([...]))`; functional interceptors. `fetch` is
  the default backend in v22 (`withXhr()` only if XHR features such as upload progress are needed).
- Reads: prefer `httpResource()` (or `resource()` for non-HTTP async) tied to signal params; render
  via `value()`, `isLoading()`, `error()`, `hasValue()`. Use `reload()` to refetch.
- Writes (`POST`/`PUT`/`PATCH`/`DELETE`): use `HttpClient` directly, then update/reload state.
- In components read observables via `async` pipe or `toSignal()` so subscriptions clean up.

### Dependency injection

- `@Service()` for app-wide singletons; `@Service({autoProvided: false})` plus a `providers`
  entry for scoped instances. `InjectionToken` with `useValue`/`useFactory` for config.
- `inject()` only in an injection context (field initializers, constructor, factory,
  `runInInjectionContext`).

### Forms

- New forms on v22+: Signal Forms (`form()`, `[formField]`, schema validators such as `required`,
  `email`, `minLength`, `validate()`). Initial values never `null`/`undefined`.
- Do not mix with `FormControl`/`FormGroup`/`FormBuilder` in the same form. Existing forms: keep the
  project's current strategy. Details: `references/official/angular-developer/references/signal-forms.md`.
- `submit()` callback must be `async` and return a Promise. Do not put native validation attributes
  (`min`, `required`, `value`) on elements bound with `[formField]`; express rules in the schema.

### Routing and rendering

- Lazy load features with `loadComponent` / `loadChildren`; functional guards (`CanActivateFn`,
  `CanMatchFn`) and resolvers (`ResolveFn`).
- Bind route params to inputs with `withComponentInputBinding()`.
- Choose CSR, SSG or SSR per route; with SSR use hydration and avoid direct browser globals
  (`window`, `document`, `new Date()` assumptions) outside `afterNextRender`/`afterRenderEffect`.

### Change detection

- Zoneless is the default since v21 and `OnPush` the default since v22. Do not add
  `provideZoneChangeDetection` or `zone.js`. Make state changes through signals, `async` pipe or
  events so the scheduler notices them.

### Accessibility

- Semantic HTML first; correct labels, roles, focus order and visible focus.
- For Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid use Angular Aria
  (`@angular/aria`) headless primitives. See `references/official/angular-developer/references/angular-aria.md`.

### Testing

- Vitest is the default runner for new CLI projects (`ng test`, jsdom). TestBed is zoneless by default.
- Act, then `await fixture.whenStable()`; do not drive tests with `fixture.detectChanges()` or
  `markForCheck()`.
- Set inputs with `fixture.componentRef.setInput()`. Prefer component harnesses and
  `RouterTestingHarness` for routing. Test behavior through the DOM, not private state.

### Tooling

- Scaffold with the CLI (`ng g c`, `ng g s`, ...) and modernize via `ng generate @angular/core:<migration>`
  (e.g. `inject`, `signal-input-migration`, `control-flow`). See `references/official/angular-developer/references/migrations.md`.

## Reference index

- `references/angular-22-features.md` - newer 22.x APIs (maintained separately; read before each task).
- `references/official/best-practices.md` - verbatim angular.dev best-practices file.
- `references/official/guidelines.md` - verbatim angular.dev Copilot/VS Code guidelines file.
- `references/official/angular-developer/SKILL.official.md` - verbatim official `angular-developer`
  skill; its `references/*.md` cover components, signals, resource, http, forms, DI, routing,
  SSR, aria, styling, testing, CLI, MCP in depth. Load the topic file you need.
- `references/official/angular-new-app/SKILL.official.md` - official skill for `ng new`.
- `SOURCE.md` - provenance, licence, update procedure.
