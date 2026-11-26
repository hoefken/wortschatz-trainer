---
name: angular-material-m3
description: Angular Material / CDK 22.3 with Material 3 theming. Use whenever building or reviewing UI with Angular Material or the CDK in this workspace (tabs, table + sort, form fields/inputs, dialog, snackbar, chips, progress bar, cards, buttons), writing the theme file (mat.theme, colors, typography, density, light/dark), styling components (--mat-sys-* variables, utility classes, mat.<component>-overrides), accessibility (labels, focus, contrast, LiveAnnouncer) or tests with component harnesses.
---

# Angular Material 22.3 (Material 3)

Verified against `angular/components` tag `v22.3.0` (docs sources, API goldens, Sass sources),
retrieved 2026-11-22. Details and harness APIs per component: `references/components.md`.
Provenance: `SOURCE.md`. If something is not covered here, check the docs before writing code.

## Setup

```bash
ng add @angular/material   # asks: prebuilt theme or "custom", global typography
```

`ng add` installs Material + CDK, adds Roboto and the Material Symbols font to `index.html`, and
writes a theme with `mat.theme()` (for "custom"). The generated theme puts
`color-scheme: light` on `body`.

- No `provideAnimations()` needed: Material no longer depends on `@angular/animations`.
  Disable animations (e.g. in tests) with
  `{provide: MATERIAL_ANIMATIONS, useValue: {animationsDisabled: true}}` from `@angular/material/core`.
- Import standalone pieces per component (`imports: [...]`), e.g. `MatButton`, `MatCardModule`,
  `MatTableModule`, `MatSortModule`, `MatFormFieldModule`, `MatInputModule`, `MatChipsModule`,
  `MatTabsModule`, `MatProgressBar`, `MatDialogModule`. Services (`MatDialog`, `MatSnackBar`) are
  injected with `inject()`, no module import needed for the service itself.

## Theme file (`src/styles.scss`)

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light dark;            // follow OS; use `light` to force light
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
      // theme-type: light | dark | color-scheme (default: color-scheme => light-dark())
    ),
    typography: (
      plain-family: Roboto,
      brand-family: Roboto,
      bold-weight: 700, medium-weight: 500, regular-weight: 400,
    ),
    density: 0,                        // 0 .. -5, each step -4px
  ));
  @include mat.strong-focus-indicators();   // visible focus outlines (WCAG)
  @include mat.system-classes();            // optional utility classes (see below)
}

body {
  margin: 0;
  background: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  font: var(--mat-sys-body-medium);
}
```

Rules:
- `mat.theme()` emits only the categories you pass (`color`, `typography`, `density`).
- `color` can be a single palette (used for primary, secondary, tertiary) or a map with
  `primary`, `tertiary`, `theme-type`.
- Prebuilt palettes: `$red-palette $green-palette $blue-palette $yellow-palette $cyan-palette
  $magenta-palette $orange-palette $chartreuse-palette $spring-green-palette $azure-palette
  $violet-palette $rose-palette`.
- Brand color: `ng generate @angular/material:theme-color` creates `_theme-colors.scss` with
  `$primary-palette` / `$tertiary-palette` (palettes optimised for contrast). Option
  `includeHighContrast` also generates `high-contrast-overrides(light|dark|color-scheme)`.
- Do not use `mat.define-theme`, `mat.define-light-theme`, `mat.define-dark-theme` or
  `mat.core()`-era patterns for new code; those are pre-v19 / M2 APIs.
- Prebuilt M3 CSS themes (`azure-blue.css`, `rose-red.css`, `cyan-orange.css`,
  `magenta-violet.css`) are an alternative, but a custom theme is needed for token customisation.

## Light / dark

Color variables use CSS `light-dark()`, so the mode follows `color-scheme`.
No `color-scheme` declared means light colors only.

```scss
html { color-scheme: light; @include mat.theme((color: mat.$azure-palette)); }
body.dark-mode { color-scheme: dark; }      // toggle class from the app
```

Material never reacts to `prefers-color-scheme` / `prefers-contrast` by itself; write the media
query or read the saved preference yourself. For old browsers without `light-dark()`, set
`theme-type: light` or `dark` explicitly.

High contrast (generated palettes only):

```scss
@use './theme-colors' as my-theme;
@media (prefers-contrast: more) { @include my-theme.high-contrast-overrides(color-scheme); }
```

## Styling your own components: system variables

Use `--mat-sys-*` variables in component styles; never hard-code colors.

| Group | Variables (selection) |
|---|---|
| Color | `primary`, `on-primary`, `primary-container`, `on-primary-container`, `secondary(-container)`, `tertiary(-container)`, `error`, `on-error`, `error-container`, `surface`, `on-surface`, `on-surface-variant`, `surface-container-lowest/low/(none)/high/highest`, `surface-variant`, `inverse-surface`, `inverse-on-surface`, `outline`, `outline-variant`, `scrim`, `shadow` |
| Typography | `{display,headline,title,body,label}-{large,medium,small}` plus `-font`, `-size`, `-weight`, `-line-height`, `-tracking` |
| Shape | `corner-none`, `corner-extra-small` (4px), `corner-small` (8px), `corner-medium` (12px), `corner-large` (16px), `corner-extra-large` (28px), `corner-full`, plus `-top`/`-start`/`-end` variants |
| Elevation | `level0` .. `level5` (full `box-shadow` values) |

```scss
@use '@angular/material' as mat;   // only needed for the mixin; variables work in plain CSS

.banner {
  background: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);   // always pair X with on-X for contrast
  border: 1px solid var(--mat-sys-outline-variant);
  border-radius: var(--mat-sys-corner-medium);
  box-shadow: var(--mat-sys-level1);
  @include mat.typography-title-medium;        // font + letter-spacing (added in v22.0)
}
```

`font: var(--mat-sys-title-medium)` does not set letter-spacing; use the
`mat.typography-<level>` mixin (e.g. `mat.typography-body-large`) or add
`letter-spacing: var(--mat-sys-title-medium-tracking)`.

Utility classes from `mat.system-classes()` (names verified in Sass source):
`mat-bg-{primary,primary-container,secondary,secondary-container,error,error-container,surface,surface-container[-lowest|-low|-high|-highest],surface-variant,inverse-surface,disabled}`,
`mat-text-{primary,secondary,error,on-primary,on-primary-container,on-secondary,on-secondary-container,on-error,on-error-container,on-surface,on-surface-variant,inverse-on-surface,disabled}`,
`mat-font-{display,headline,title,body,label}-{lg,md,sm}`, `mat-corner-{xs,sm,md,lg,xl,full}`,
`mat-shadow-{1..5}`, `mat-border`, `mat-border-subtle`.
Docs pitfall: the theming guide mentions `mat-border-variant` and `mat-font-body-medium`; neither
class exists in 22.3 (use `mat-border-subtle`, `mat-font-body-md`).

## Customising Material components: overrides mixins only

```scss
html {
  // System token, globally or in a scope:
  @include mat.theme-overrides((primary-container: #d7e3ff));

  // Component tokens (names = Styling tab on material.angular.dev, without component prefix):
  @include mat.card-overrides((elevated-container-shape: 16px, title-text-size: 1.25rem));
  @include mat.tabs-overrides((active-indicator-color: var(--mat-sys-tertiary)));
  @include mat.form-field-overrides((outlined-outline-color: var(--mat-sys-outline)));
}
.compact-table { @include mat.table-overrides((row-item-container-height: 40px)); }
```

- Mixin names: `button-`, `card-`, `chips-`, `dialog-`, `form-field-`, `progress-bar-`,
  `snack-bar-`, `sort-`, `table-`, `tabs-overrides`. Unknown token names fail the Sass build with
  the list of valid tokens, which is a quick way to look them up.
- Alternatively `mat.theme((...), $overrides: (primary-container: orange))`.
- Context theme: call `mat.theme((color: mat.$cyan-palette))` inside a selector to recolor a
  subtree. A `density`-only call scoped to a container compacts just that area.
- Never: `::ng-deep`, `.mat-mdc-*` / `.mdc-*` selectors, `ViewEncapsulation.None` hacks, or
  setting `--mat-*` component variables by hand. Docs: DOM structure and CSS classes are private
  and may change at any time. (Documented exception: `mat-mdc-chip-set-stacked` class on chip
  containers for vertical chips.)
- The `color` input (button, chips, progress bar, ...) is "supported in M2 themes only, it has
  no effect in M3 themes" (API docs). In M3 recolor via overrides or a scoped `mat.theme()`;
  `mat.color-variants-backwards-compatibility($theme)` exists only as a migration aid.

## Density and typography

- Keep `density: 0` for touch / accessibility; docs: density below 0 "can reduce accessibility".
  Task-based / pop-up contexts such as the datepicker ignore density by design.
- Load fonts in `index.html` (Google Fonts link added by `ng add`); the CLI inlines Google Fonts
  CSS by default.

## Accessibility checklist (WCAG 2.2 AA)

- Every form control has `<mat-label>` (or `aria-label`/`aria-labelledby` when no label).
  `<mat-hint>`/`<mat-error>` are wired into `aria-describedby` automatically; errors are
  `aria-live="polite"`. Do not rely on color for errors; say "Error:" or use an icon.
- Icon-only buttons (`matIconButton`, `matFab`, `matMiniFab`) need `aria-label`; touch target
  min 48x48. Do not write button text in ALL CAPS.
- Table: `aria-label` on `<table mat-table>`. Sort: set `sortActionDescription` on each
  `mat-sort-header` and announce `matSortChange` with `LiveAnnouncer` (screen readers do not
  announce `aria-sort` changes).
- Tabs: icon-only tab labels need `aria-label`; `<nav mat-tab-nav-bar>` needs a label and a
  nearby `<mat-tab-nav-panel>`.
- Dialog: set `ariaLabelledBy`/`ariaLabel` (or use `mat-dialog-title`), keep Escape-to-close
  (`disableClose` breaks the dialog pattern), restore focus manually if the opener is gone.
- Snackbar: does not move focus. No `duration` when it has an action; offer the action elsewhere
  too. Use `politeness: 'assertive'` only for urgent messages.
- Chips: `aria-label` on `mat-chip-listbox`/`mat-chip-grid`; `matChipRemove` only on `<button>`
  with `aria-label`; no interactive controls inside `mat-chip-option`.
- Progress bar: always `aria-label` or `aria-labelledby`; leave `aria-valuemin/max` at 0/100.
- Contrast: use only role pairs (`X` / `on-X`, `surface*` / `on-surface(-variant)`);
  custom palettes via the theme-color schematic. Verify with axe or Lighthouse in both modes.
- Focus: `mat.strong-focus-indicators()`; if the indicator lacks contrast in a region, use
  `mat.strong-focus-indicators-theme($color)` there. Never remove outlines.
- CDK a11y helpers: `LiveAnnouncer`, `FocusMonitor` / `cdkMonitorElementFocus`, `cdkTrapFocus`,
  `.cdk-visually-hidden` (included by Material), `@include cdk.high-contrast { ... }` for
  `forced-colors`.

## Testing with component harnesses

```ts
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MATERIAL_ANIMATIONS} from '@angular/material/core';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatDialogHarness} from '@angular/material/dialog/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [UserList],
    providers: [{provide: MATERIAL_ANIMATIONS, useValue: {animationsDisabled: true}}],
  });
  fixture = TestBed.createComponent(UserList);
  loader = TestbedHarnessEnvironment.loader(fixture);           // inside the component
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture); // overlays
});

it('opens the delete dialog', async () => {
  await (await loader.getHarness(MatButtonHarness.with({text: 'Delete'}))).click();
  const dialog = await rootLoader.getHarness(MatDialogHarness);
  expect(await dialog.getTitleText()).toBe('Delete user?');
});
```

- Harnesses live in `@angular/material/<component>/testing`; all methods are async.
- Dialogs and snackbars render in the overlay: use `documentRootLoader`.
- Filter with `Harness.with({selector, ancestor, ...})` instead of array indices.
- Harness docs moved to angular.dev (`/guide/testing/component-harnesses-overview`).

## Common pitfalls

- Recreating `MatTableDataSource` on new data breaks sorting: assign `dataSource.data = rows`.
- `dataSource.sort = this.sort()` only after the view exists (`ngAfterViewInit` or an effect on a
  `viewChild` signal). Column id must match the property, otherwise set `sortingDataAccessor`.
- `MAT_DIALOG_DEFAULT_OPTIONS` replaces all defaults; spread `...new MatDialogConfig()` first.
- `mat-form-field` needs a control (`matInput`/`matNativeControl`, `mat-select`,
  `mat-chip-grid`), otherwise "must contain a MatFormFieldControl".
- Only one hint per side; `hintLabel` occupies the start side.
- `matButton` appearances: `text` (default), `filled`, `tonal`, `outlined`, `elevated`
  (`matButton="filled"`). The old `mat-raised-button`/`mat-flat-button`/`mat-stroked-button`
  selectors still match `MatButton`, but the docs only describe `matButton="..."`; use that.
- Chips + autocomplete: import `MatAutocompleteModule` before `MatChipsModule`.
- Theme styles are global; with Shadow DOM, load the theme into each shadow root.
