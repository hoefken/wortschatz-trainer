# Angular 22.0 – 22.3 feature map (framework, CLI, Material/CDK)

Use this to decide which API to use when building a new Angular 22.3 + Material 22.3 app. Each row cites the changelog version where the entry appears.

## Sources (retrieved 2026-11-22)

- Framework changelog: https://github.com/angular/angular/blob/main/CHANGELOG.md (22.0.0 to 22.3.0; the 22.0.0 entry consolidates 22.0.0-next.0 to rc.3)
- Framework pre-releases: https://api.github.com/repos/angular/angular/releases (v22.0.0-next.0 to v22.0.0-rc.3), cross-checked against the consolidated 22.0.0 entry
- CLI changelog: https://github.com/angular/angular-cli/blob/main/CHANGELOG.md (22.0.0 to 22.3.0) plus https://api.github.com/repos/angular/angular-cli/releases
- Components changelog: https://github.com/angular/components/blob/main/CHANGELOG.md (22.0.0 to 22.3.0)
- Stability: JSDoc tags (`@publicApi X`, `@developerPreview X`, `@experimental X`) read from source at tag v22.3.0 (https://github.com/angular/angular/tree/v22.3.0/packages) and the adev guides in the same tag (`adev/src/content/guide/**`, `reference/versions.md`, `reference/releases.md`)
- `ng new` defaults: schematic schemas at https://github.com/angular/angular-cli/tree/v22.3.0/packages/schematics/angular (`ng-new`, `application`, `component`, `service` schema.json; `utility/latest-versions/package.json`)
- Blog post "Announcing Angular v22" (https://blog.angular.dev/announcing-angular-v22-c52bb83a4664, linked from the 22.0.0 changelog): **not readable** (HTTP 403). Nothing below comes from it.

Stability rule: "stable" means a `@publicApi` tag and no preview tag in v22.3.0 source. "dev preview" and "experimental" come from source tags or adev `IMPORTANT:` notes. "unverified" means no tag or note was found.
"Use?" values: **yes** = use by default, **maybe** = use only when needed, **no** = skip in this app.

## Core / Signals / DI

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Default `changeDetection` is now `OnPush`; `ChangeDetectionStrategy.Eager` replaces `Default` (`Default` is `@deprecated` in 22.3 source) | 22.0.0 | stable | yes: leave it off (OnPush by default) and design state with signals |
| `@Service()` decorator (root-provided by default); `ng g service` emits `@Service` (`--injectable` gives `@Injectable`) | 22.0.0 (changelog also says "mark service decorator as stable") | stable (`@publicApi`) | yes: for new services |
| Migration from `@Injectable` to `@Service` | 22.1.0 | n/a | no: greenfield app |
| `resource()`, `rxResource()`, `httpResource()` | graduated in 22.0 (`@publicApi 22.0`) | stable | yes: async loading (e.g. word lists) |
| Special return statuses for resource params; stream resources accept synchronous values | 22.0.0 | stable (part of resource API) | maybe |
| Cancel obsolete resource loads when params become unavailable (fix) | 22.3.0 | n/a | n/a |
| `resourceFromSnapshots` | 22.x (version unverified) | experimental | no |
| `debounced()` signal debouncing | 22.0.0 | experimental (`@experimental 22.0`) | maybe: search box, but you accept API churn |
| `linkedSignal` custom `set` option | 22.1.0 | stable (`linkedSignal` `@publicApi 20.0`) | maybe |
| `injectAsync()` helper | 22.0.0 | stable (`@publicApi 22.0`) | maybe: lazy-loading heavy services |
| Error boundaries in templates: `@boundary { } @error { }` with `$error` | 22.2.0 | dev preview (adev) | maybe: wrap risky widgets; not needed for a small app |
| `ErrorBoundary` programmatic APIs; `onError`/`ErrorDetails` for programmatic rendering | 22.2.0 | dev preview (`ErrorDetails` `@developerPreview 22.2`) | no |
| De-duplicated host directives | 22.0.0 | stable | n/a |
| Bootstrap under shadow roots; `ApplicationRef.bootstrap` with config | 22.0.0 | unverified | no |
| `provideZonelessChangeDetection` (zoneless itself is not new in 22) | `@publicApi 20.2` | stable | yes: `ng new` defaults to zoneless (see below) |
| `provideCheckNoChangesConfig` | `@developerPreview 20.0` | dev preview | no |
| Nested leave animations scoped to component boundaries | 22.0.0 | unverified | maybe: list item enter/leave |
| WebMCP: `provideExperimentalWebMcpTools`, `declareExperimentalWebMcpTool`, `provideExperimentalWebMcpForms` | 22.0.0 / 22.2.0 | experimental | no |
| AI runtime debugging tools, DI graph in-page tool, `debugging` annotation | 22.0.0 / 22.3.0 | unverified | no |
| Testability uses `PendingTasks` for stability | 22.0.0 | n/a (internal behavior) | n/a: matters for e2e waits |

## Templates / Control flow / Compiler

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Increment/decrement operators (`++`, `--`) in template expressions | 22.3.0 | unverified (no tag; compiler feature) | maybe: prefer component methods |
| HTML comments inside an element tag | 22.0.0 | unverified | maybe |
| Optional chaining in templates returns `undefined` (previously `null`) | 22.0.0 (breaking) | stable | yes: be aware when comparing with `null` |
| Safe navigation narrows nullables in type checking | 22.0.0 | stable | yes (free) |
| Templates can access `private` class members | 22.2.0 | unverified | maybe: prefer `protected` for template-only members |
| `strictUnclaimedEventNames` compiler option (catches misspelled outputs) | 22.2.0 | unverified | yes: enable in tsconfig `angularCompilerOptions` |
| Exhaustive type checking accepts other expressions | 22.0.0 | unverified | maybe |
| `@defer`: `on idle` customization and timeout, `IdleRequestOptions` on `IdleService` | 22.0.0 | stable (`IdleService` `@publicApi`) | maybe: defer stats/settings views |
| `@defer` viewport `scrollMargin` option | 22.3.0 | unverified | no |
| Warning for `prefetch` without a main defer trigger | 22.0.0 | n/a | n/a |
| `@for` no longer suppresses non-iterable values (fix) | 22.3.0 | n/a | n/a: errors surface |
| Unknown property bindings on `<ng-template>` reported; check for numeric CSS properties requiring units | 22.3.0 | n/a (diagnostics) | yes (free) |
| `data-` attributes no longer bind inputs/outputs; duplicate input/output bindings throw; `in` in expressions throws; multiple matching selectors throw at compile time | 22.0.0 (breaking) | n/a | yes: just don't do these |
| Migration: static `ngClass` to `class` bindings | 22.2.4 | n/a | yes: write `[class.x]`/`class` directly, not `ngClass` |
| Language service: inlay hints, document symbols, smart selection | 22.0.0 / 22.3.0 | n/a (IDE) | yes |

## Forms

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Signal Forms (`@angular/forms/signals`: `form`, `schema`, `FormField`/`[formField]`, `FormRoot`, `submit`, `applyEach`, `validateAsync`, `validateHttp`, `debounce`) graduated to public API | 22.0.0 ("graduate signal forms APIs to public API") | stable (`@publicApi 22.0`) | yes: default choice for word-entry and quiz forms |
| `FieldState.getError()` | 22.0.0 | stable | yes |
| `reloadValidation` (manually re-run async validation) | 22.0.0 | stable | maybe |
| `debounce` option for `validateAsync`/`validateHttp`; `'blur'` option on the `debounce` rule | 22.0.0 (blur: 22.0.0-next.1) | stable | maybe: duplicate-word check |
| Bind `number \| null` to `<input type="text">` | 22.0.0 | stable | maybe |
| `ngNoCva` opt-out; `FormValueControl` (FVC) usable in template and reactive forms; legacy `NG_VALIDATORS` shim | 22.0.0 | stable | maybe: custom controls only |
| Permanently hidden fields | 22.2.0 | stable | maybe |
| `isFieldTree()` assertion | 22.1 (`@publicApi 22.1`) | stable | maybe |
| `min`/`max` rules accept only numbers or `null` (no strings) | 22.0.0 (breaking) | n/a | yes: bind numbers |
| Reactive/template-driven forms | unchanged | stable | no: use Signal Forms in a new app unless a library requires CVA |

## Router

| Feature | Since | Stability | Use? |
|---|---|---|---|
| `paramsInheritanceStrategy` defaults to `'always'` | 22.0.0 (breaking) | stable | yes: child routes see parent params |
| `withComponentInputBinding(options)`, `unmatchedInputBehavior` | 22.0.0 | stable (`withComponentInputBinding` has no tag in source) | yes: route params as `input()` |
| `RouterLink` `browserUrl` input | 22.0.0 | unverified | no |
| `withViewTransitions` marked stable | 22.3.0 (`@publicApi 22.3`) | stable | maybe: route transitions; define the CSS in global styles |
| Route resources: `withRouterResources`, `resources` on routes, reactive and parallel dependent loading | 22.2.0 / 22.3.0 | dev preview (`@developerPreview 22.2/22.3`) | maybe: or use plain `httpResource` in the component (stable) |
| Route error boundaries: `withErrorBoundaries`, `errorComponent`, `isErrorComponentActive` | 22.3.0 | dev preview (`@developerPreview 22.3`) | maybe |
| Throw `RedirectCommand` to redirect | 22.2.0 | unverified | maybe: guards |
| `focusReset` in `NavigationBehaviorOptions` | 22.3.0 | experimental (`@experimental 22.3`) | no |
| `RouterLink` `scroll` input; "support direct component param" | 22.3.0 | unverified | maybe |
| `withAutoCleanupInjectors` stabilized | 22.2.0 (`@publicApi 22.2`) | stable | no: few lazy routes |
| `containsTree` public; `destroyDetachedRouteHandle` | 22.2.0 | stable | no |
| `withExperimentalPlatformNavigation` | `@experimental 21.1` | experimental | no |
| `RouterTestingHarness.navigate` | 22.3.0 | stable (`RouterTestingHarness` public; no tag on the method) | yes: routed component tests |
| `CanMatchFn` `currentSnapshot` parameter required; `provideRoutes()` removed; `getResolvedTitleForRoute` typed `string \| undefined` | 22.0.0 (breaking) | n/a | n/a |

## HTTP / Resources

| Feature | Since | Stability | Use? |
|---|---|---|---|
| `FetchBackend` is the default `HttpBackend`; `withFetch()` deprecated (remove it) | 22.0.0 | stable / deprecated | yes: plain `provideHttpClient()` |
| `withXhr()` to keep XHR (needed for upload progress) | 22.0.0 | stable | no |
| `reportUploadProgress` / `reportDownloadProgress` replace deprecated `reportProgress` | 22.0.0 | stable | no |
| `HttpClient.query()` (HTTP QUERY method) | 22.3.0 | stable (no preview tag on member) | no |
| JSONP (`HttpClient.jsonp`, `HttpClientJsonpModule`) deprecated | 22.1.0 | deprecated | no |
| Transfer-cache options for credentialed/non-cacheable requests; resource caching for SSR | 22.1.0 / 22.0.0 | unverified | no (no SSR) |

## SSR / Hydration (brief; app is a client-only PWA)

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Incremental hydration is the default | 22.0.0 | stable | no: `ng new` defaults to `ssr: false` |
| `CommonEngine` deprecated (use `AngularNodeAppEngine`/`AngularAppEngine`); host validation returns 400 with no CSR fallback; XHR in `platform-server` deprecated | CLI 22.0.0 / fw 22.0.1 | deprecated / breaking | no |
| `prerender.format` (`<route>.html` output) | CLI 22.3.0 | unverified | no |
| `@angular/ssr` supports the `Forwarded` header | CLI 22.1.0 | unverified | no |

## CLI / Build / Test tooling

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Vitest is the default unit-test runner; `testRunner` option deprecated (Vitest only in a future version) | CLI 22.3.0 deprecation; default `vitest` in schema | stable | yes |
| Vitest 5 (`vitest ^5.0.0`, `jsdom ^31`, `@vitest/browser-playwright ^5`, `playwright ^1.48` in latest-versions) | CLI 22.2.0 references Vitest 5 | stable | yes |
| unit-test builder options: `isolate`, `quiet`, Istanbul coverage, runtime Zone.js detection | CLI 22.0.0 | unverified | maybe |
| unit-test `polyfills` option | CLI 22.3.0 | unverified | maybe |
| unit-test `splitting` option deprecated | CLI 22.2.0 | deprecated | no |
| `TestBed.getLastFixture()` | 22.0.0 | stable | maybe |
| `TestBed.createDirective(directive, {tagName, bindings})` | 22.2.0 (`TestDirectiveOptions` `@publicApi 22.2`) | stable | maybe: directive tests |
| Karma to Vitest migrations (`refactor-jasmine-vitest`, fakeAsync to fake timers) | CLI 22.0.0 | n/a | no: greenfield |
| Karma and Jest/Web-Test-Runner: experimental Jest and WTR builders removed; `istanbul-lib-instrument` is an optional peer | CLI 22.0.0 | removed | no |
| Webpack builders (`@angular-devkit/build-angular`, `build-webpack`, `@ngtools/webpack`) deprecated; use `@angular/build` | CLI 22.0.0 | deprecated | yes: stay on `@angular/build` (default) |
| Chunk optimization on by default (Rolldown-based from 22.1.0); SRI for lazy chunks; persistent SQLite build cache, shared across git worktrees | CLI 22.0.0 / 22.1.0 | unverified | yes (automatic) |
| `PORT` env var takes priority over `--port`/angular.json in `ng serve` | CLI 22.0.0 (breaking) | stable | yes: watch out in Playwright `webServer` config |
| `experimentalPlatform` renamed to `platform` (application builder) | CLI 22.0.0 | unverified | no |
| Oxfmt supported for automatic file formatting (workspace still ships `prettier ^3.8.1`) | CLI 22.3.0 | unverified | maybe |
| `ng mcp` (`--root`); `ai-config` includes Angular MCP server config; `aiConfig` generates `CLAUDE.md` for Claude Code | CLI 22.1.0 / 22.2.0 / 22.1.4 | unverified | maybe |
| `@angular/build:library` builder; `ng-packagr` builder deprecated | CLI 22.3.0 | stable / deprecated | no |
| `@angular/pwa`: only a fix (manifest link when `index` is an object) | CLI 22.2.7 | n/a | yes: `ng add @angular/pwa` unchanged |

## Material / CDK / Aria (components 22.x)

| Feature | Since | Stability | Use? |
|---|---|---|---|
| Signal Forms integration: `MatFormFieldControl` support, error-state matcher reworked, stepper accepts a signal form as `stepControl`, duplicate required errors fixed in checkbox/slide-toggle, datepicker parse error | 22.0.0 to 22.2.5 (fixes) | stable | yes: Material + Signal Forms works on 22.3 |
| Values input renamed `values` to `value` (Combobox, Listbox, Tree, Menu, Toolbar, Select) for signal forms compatibility | 22.0.0 (breaking) | n/a | n/a |
| Button progress indicator | 22.0.0 | unverified | yes: "saving..." / submit state |
| Dialog and bottom-sheet "bindings" option (CDK dialog too); `ComponentPortal` directives | 22.0.0 | unverified | maybe: pass inputs to dialogs |
| Material Design typography mixins (`core`) | 22.0.0 | unverified | maybe |
| Tabs: separate animation durations | 22.0.0 | unverified | no |
| Slide-toggle full-width support | 22.1.0 | unverified | maybe |
| Icons: Material Symbol classes added automatically; menu item `disabledInteractive` | 22.2.0 | unverified | yes / maybe |
| Chips leading icon; stepper header icon-shape token | 22.3.0 | unverified | maybe |
| `@angular/aria`: Combobox promoted (old combobox/autocomplete removed, `SimpleCombobox` renamed `Combobox`), harnesses for accordion/combobox/grid/listbox/menu/tabs/toolbar/tree | 22.0.0 | unverified (package stability not checked) | no: use Material components |
| CDK removals: `CDK_DESCRIBEDBY_*`, `MESSAGES_CONTAINER_ID`; `FocusTrap` needs `injector`; `ContextMenuTracker` renamed `MenuTracker`; `MatListOption.checkboxPosition` replaced by `togglePosition` | 22.0.0 (breaking) | n/a | n/a |

## Breaking changes and deprecations in 22.x that matter for a new app

- Toolchain: Node.js 20 dropped. CLI breaking note: minimum Node.js v22.22.0 / v24.13.1. `reference/versions.md` lists `^22.22.3 || ^24.15.0 || ^26.0.0` for 22.x. TypeScript `>=6.0.0 <6.1.0` (TS 5.9 dropped, fw 22.0.0). RxJS `^6.5.3 || ^7.4.0`.
- Components without `changeDetection` are OnPush. Mutating objects or arrays in place will not refresh the view, so update state through signals (fw 22.0.0).
- `paramsInheritanceStrategy: 'always'` is the default (fw 22.0.0).
- HTTP uses Fetch by default. Don't add `withFetch()` (deprecated). Upload progress needs `withXhr()` (fw 22.0.0).
- Optional chaining in templates now yields `undefined`, not `null` (fw 22.0.0). New `nullishCoalescingNotNullable`/`optionalChainNotNullable` diagnostics; strict templates are the generated default (CLI 22.0.0).
- Signal Forms `min`/`max` accept numbers only (fw 22.0.0).
- Removed: `ComponentFactoryResolver`/`ComponentFactory`, `createNgModuleRef`, `ChangeDetectorRef.checkNoChanges`, `provideRoutes()`, Hammer.js integration (fw 22.0.0). Material/CDK: see the table above (components 22.0.0).
- Platform-browser drops styles no longer used by an associated host (fw 22.0.0). Global styles are not affected; this matters only for shared non-emulated styles.
- `ng serve`: the `PORT` env var overrides `--port` (CLI 22.0.0).
- Deprecated: `withFetch`, `reportProgress` (fw 22.0.0); JSONP (fw 22.1.0); `ChangeDetectionStrategy.Default` (use `Eager`); webpack builders, `CommonEngine` (CLI 22.0.0); unit-test `splitting` (CLI 22.2.0); `testRunner` schematic option, `ng-packagr` builder (CLI 22.3.0).

## Defaults of `ng new` in 22.3 (verified from schematic schemas and templates at v22.3.0)

- `standalone: true` (no NgModules). `strict: true`, and strict templates are the default (CLI 22.0.0).
- `zoneless: true` (application schema). The `app.config.ts` template adds `provideZoneChangeDetection` only when not zoneless. The template always includes `provideBrowserGlobalErrorListeners()`, plus `provideRouter(routes)` when routing is on.
- `routing: true`, `ssr: false`, `style: css` (options `css|scss|sass|less|tailwind`), `prefix: app`.
- `testRunner: vitest` (the `karma` option still exists but is deprecated in 22.3.0). Vitest ^5 + jsdom ^31; browser mode via `@vitest/browser-playwright` is listed in latest-versions.
- `fileNameStyleGuide: "2025"`: concise names (`app.ts`, `app.html`), no `.component` suffix. `"2016"` restores the old suffixes.
- `ng g component`: `changeDetection` default `OnPush` (enum `Eager|OnPush`), `standalone: true`, `style: css`.
- `ng g service`: generates `@Service()`; `--injectable` generates `@Injectable` instead.
- Generated `package.json` includes `prettier ^3.8.1`. Playwright e2e is **not** set up by `ng new`: the `playwright` package in latest-versions belongs to Vitest browser mode. Add `@playwright/test` yourself.
- `aiConfig` option exists to generate AI tool config files (values not checked).

## Not verified

- The v22 announcement blog post (HTTP 403), so blog-only claims are missing.
- Stability of compiler/template syntax features (increment operators, comments in tags, private member access) and of Material/CDK feature additions: no source tags checked. Material features are normally stable when released, but this was not confirmed per feature.
- Exact API names behind "support direct component param" (router 22.3.0) and the Oxfmt integration details (CLI 22.3.0).
- `@angular/aria` package-level stability.
