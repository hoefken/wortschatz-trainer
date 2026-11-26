# Components reference (Angular Material 22.3, M3)

Sources: `src/material/<c>/<c>.md` (Overview / Accessibility tabs), `goldens/material/<c>/index.api.md`
and `goldens/material/<c>/testing/index.api.md` (API, harnesses), `src/material/<c>/_m3-*.scss`
(Styling tab tokens) at tag `v22.3.0`. Token keys are listed as used in `mat.<c>-overrides((...))`,
i.e. without the component prefix. Full lists: `https://material.angular.dev/components/<c>/styling`.

Harness imports: `@angular/material/<c>/testing`. All harness methods return Promises.

---

## Tabs (`MatTabsModule`)

- Elements: `<mat-tab-group>`, `<mat-tab label="...">`, custom label `<ng-template mat-tab-label>`,
  lazy body `<ng-template matTabContent>`, routing `<nav mat-tab-nav-bar [tabPanel]="panel">` +
  `<a mat-tab-link [active]="...">` + `<mat-tab-nav-panel #panel>`.
- Inputs (group): `selectedIndex`, `dynamicHeight`, `preserveContent`, `animationDuration`
  (`'0ms'` disables), `mat-stretch-tabs` / `stretchTabs`, `mat-align-tabs` / `alignTabs`,
  `headerPosition`, `disablePagination`, `fitInkBarToContent`. Global: `MAT_TABS_CONFIG`.
- Outputs: `selectedTabChange`, `focusChange`, `selectedIndexChange`.
- Tokens (`mat.tabs-overrides`): `active-indicator-color`, `active-indicator-height`,
  `active-indicator-shape`, `active-label-text-color`, `inactive-label-text-color`,
  `active-focus-label-text-color`, `active-hover-label-text-color`, `divider-color`,
  `divider-height`, `container-height`, `label-text-font/size/weight/tracking/line-height`,
  `pagination-icon-color`. `background-color` / `foreground-color` only work with the M2
  `backgroundColor` input.
- A11y: implements ARIA Tabs pattern (arrow keys, Home/End, Space/Enter). Icon-only labels need
  `aria-label`. `mat-tab-nav-bar`: label the `<nav>`, keep `<mat-tab-nav-panel>` adjacent.
- Harnesses: `MatTabGroupHarness` (`getTabs`, `getSelectedTab`, `selectTab({label})`),
  `MatTabHarness` (`getLabel`, `isSelected`, `isDisabled`, `select`, `getTextContent`),
  `MatTabNavBarHarness`, `MatTabLinkHarness`.

## Table (`MatTableModule`) + Sort (`MatSortModule`)

```html
<table mat-table [dataSource]="dataSource" matSort (matSortChange)="announce($event)"
       aria-label="Employees">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by name">Name</th>
    <td mat-cell *matCellDef="let row">{{ row.name }}</td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
  <tr mat-row *matRowDef="let row; columns: columns"></tr>
  <tr class="mat-row" *matNoDataRow><td class="mat-cell" [attr.colspan]="columns.length">No data</td></tr>
</table>
```

```ts
dataSource = new MatTableDataSource<Employee>([]);
private sort = viewChild.required(MatSort);
private announcer = inject(LiveAnnouncer);
ngAfterViewInit() { this.dataSource.sort = this.sort(); }
announce(s: Sort) {
  this.announcer.announce(s.direction ? `Sorted ${s.direction}ending` : 'Sorting cleared');
}
```

- `*matNoDataRow` markup matches the official "table-filtering" example (`class="mat-row"` /
  `class="mat-cell"` exactly as in that example; do not style these classes yourself).
- `MatTableDataSource`: `data`, `sort`, `paginator`, `filter`, `filterPredicate`,
  `sortingDataAccessor(data, sortHeaderId)`. Update via `.data = rows`, never recreate.
- Without `MatTableDataSource`: handle `(matSortChange)` yourself; plain arrays need
  `table.renderRows()` after mutation.
- Sort API: `matSortActive`, `matSortDirection`, `matSortStart` (`'asc'|'desc'`),
  `matSortDisableClear`, `matSortDisabled`; header: `mat-sort-header="id"`, `start`,
  `disableClear`, `disabled`, `arrowPosition` (`'before'|'after'`), `sortActionDescription`.
  Types `Sort {active, direction}`, `SortDirection = 'asc'|'desc'|''`. Global:
  `MAT_SORT_DEFAULT_OPTIONS`. Custom icon: element with `matSortHeaderIcon`.
- v22 breaking: `ArrowViewState`, `ArrowViewStateTransition` removed from sort.
- Sticky: `sticky` on `matHeaderRowDef`/`matFooterRowDef`, `sticky`/`stickyEnd` on column.
- Table tokens (`mat.table-overrides`): `background-color`, `header-container-height`,
  `header-headline-color`, `header-headline-font/size/weight/...`, `row-item-container-height`,
  `row-item-label-text-color`, `row-item-label-text-font/size/...`, `row-item-outline-color`,
  `row-item-outline-width`, `footer-container-height`, `footer-supporting-text-*`.
  Sort tokens (`mat.sort-overrides`): `arrow-color`.
- A11y: `role="table"` by default (`role="grid"` adds no keyboard handling). Always
  `aria-label`/`aria-labelledby`. Sort headers render a button; give `sortActionDescription`
  and announce changes with `LiveAnnouncer`.
- Harnesses: `MatTableHarness` (`getRows`, `getHeaderRows`, `getFooterRows`, `getNoDataRow`,
  `getCellTextByIndex`, `getCellTextByColumnName`), `MatRowHarness`, `MatHeaderRowHarness`,
  `MatCellHarness` (`getText`, `getColumnName`), `MatHeaderCellHarness`;
  `MatSortHarness` (`getSortHeaders`, `getActiveHeader`), `MatSortHeaderHarness`
  (`click`, `getLabel`, `getSortDirection`, `isActive`, `isDisabled`).

## Form field (`MatFormFieldModule`) + Input (`MatInputModule`)

```html
<mat-form-field appearance="outline">
  <mat-label>E-mail</mat-label>
  <input matInput type="email" [formControl]="email" required />
  <mat-hint>Work address</mat-hint>
  @if (email.hasError('email')) { <mat-error>Error: invalid e-mail address</mat-error> }
</mat-form-field>
```

- Form field inputs: `appearance` (`'fill'` default | `'outline'`), `floatLabel`
  (`'auto'|'always'`), `hideRequiredMarker`, `hintLabel`, `subscriptSizing`. Global:
  `MAT_FORM_FIELD_DEFAULT_OPTIONS` (`{appearance: 'outline'}`).
- Content: `<mat-label>`, `<mat-hint align="start|end">` (one per side), `<mat-error>`,
  `matPrefix`/`matSuffix`, `matTextPrefix`/`matTextSuffix` for text.
- Input directive selector (22.3 source): `input[matInput], textarea[matInput],
  select[matNativeControl], input[matNativeControl], textarea[matNativeControl]`. Docs now mix
  `matInput` and `matNativeControl`; both work. Works with `FormField` (Signal Forms),
  `FormsModule`, `ReactiveFormsModule`. `errorStateMatcher` (Signal Forms: implement
  `isSignalErrorState`), global `ErrorStateMatcher` / `ShowOnDirtyErrorStateMatcher`.
- Supported input `type`s: color, date, datetime-local, email, month, number, password, search,
  tel, text, time, url, week.
- Tokens (`mat.form-field-overrides`, selection): `outlined-outline-color`,
  `outlined-focus-outline-color`, `outlined-container-shape`, `outlined-label-text-color`,
  `filled-container-color`, `filled-container-shape`, `filled-active-indicator-color`,
  `error-text-color`, `container-height`, `container-vertical-padding`,
  `subscript-text-font/size/...`, `leading-icon-color`, `trailing-icon-color`.
- A11y: `<mat-label>` becomes a native `<label for>`; hints/errors go to `aria-describedby`;
  `aria-invalid` follows validity; `mat-error` is `aria-live="polite"`. Static text prefixes /
  suffixes: give the input a full `aria-label` or set `aria-hidden="true"` on decorative ones.
- Harnesses: `MatFormFieldHarness` (`getLabel`, `getControl`, `hasErrors`, `getTextErrors`,
  `getTextHints`, `isControlValid`, `isDisabled`, `getAppearance`), `MatErrorHarness`,
  `MatInputHarness` (`setValue`, `getValue`, `isRequired`, `isDisabled`, `blur`, `focus`),
  `MatNativeSelectHarness`.

## Dialog (`MatDialogModule`, service `MatDialog`)

```ts
private dialog = inject(MatDialog);
open() {
  const ref = this.dialog.open(ConfirmDelete, {data: {name: 'Ada'}, ariaLabelledBy: 'confirm-title'});
  ref.afterClosed().subscribe(ok => { if (ok) this.delete(); });
}
// In ConfirmDelete: data = inject<{name: string}>(MAT_DIALOG_DATA); ref = inject(MatDialogRef);
```

```html
<h2 mat-dialog-title id="confirm-title">Delete {{ data.name }}?</h2>
<mat-dialog-content>This cannot be undone.</mat-dialog-content>
<mat-dialog-actions align="end">
  <button matButton mat-dialog-close>Cancel</button>
  <button matButton="filled" [mat-dialog-close]="true">Delete</button>
</mat-dialog-actions>
```

- Config (`MatDialogConfig`): `data`, `width`, `maxWidth`, `role` (`'dialog'|'alertdialog'`),
  `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy`, `autoFocus` (`'first-tabbable'` default,
  `'first-header'`, `'dialog'`, CSS selector), `restoreFocus`, `disableClose`,
  `closePredicate`, `enterAnimationDuration`/`exitAnimationDuration`, `bindings` (v22.0:
  pass `inputBinding(...)` etc. from `@angular/core`; seen in dialog spec, not in the guide).
- Global defaults `MAT_DIALOG_DEFAULT_OPTIONS` replace all defaults: spread
  `...new MatDialogConfig()`.
- Tokens (`mat.dialog-overrides`): `container-color`, `container-shape`,
  `container-elevation-shadow`, `container-max-width`, `container-min-width`,
  `container-small-max-width`, `subhead-color`, `subhead-font/size/...`,
  `supporting-text-color`, `supporting-text-font/size/...`, `content-padding`,
  `with-actions-content-padding`, `headline-padding`, `actions-padding`, `actions-alignment`.
- A11y: focus trapped; Escape closes (keep it); focus restored to opener. Opener gone (e.g. menu
  item) -> restore focus in `afterClosed()`.
- Harness: `MatDialogHarness` via `documentRootLoader` (`getTitleText`, `getContentText`,
  `getActionsText`, `getRole`, `getAriaLabelledby`, `close`). `MatTestDialogOpener.withComponent`
  opens a dialog component in isolation.

## Snackbar (service `MatSnackBar`)

```ts
private snackBar = inject(MatSnackBar);
saved() { this.snackBar.open('Saved', undefined, {duration: 4000}); }
undoable() {
  this.snackBar.open('Entry deleted', 'Undo').onAction().subscribe(() => this.restore());
}
```

- `open(message, action?, config?)`, `openFromComponent(Comp, {data})` (+ `MAT_SNACK_BAR_DATA`,
  directives `matSnackBarLabel`, `matSnackBarActions`, `matSnackBarAction`). Ref:
  `afterDismissed()`, `onAction()`, `dismiss()`. One snackbar at a time.
- Config: `duration`, `politeness` (`'polite'` default), `announcementMessage`,
  `horizontalPosition`, `verticalPosition`, `panelClass`. Global:
  `MAT_SNACK_BAR_DEFAULT_OPTIONS`.
- Tokens (`mat.snack-bar-overrides`): `container-color`, `container-shape`,
  `supporting-text-color`, `supporting-text-font/size/weight/line-height`, `button-color`.
- A11y: announced via `aria-live`, focus not moved. No `duration` when there is an action;
  provide the action elsewhere as well.
- Harness: `MatSnackBarHarness` via `documentRootLoader` (`getMessage`, `hasAction`,
  `getActionDescription`, `dismissWithAction`, `getAriaLive`, `getRole`, `isDismissed`).

## Chips (`MatChipsModule`)

- Static: `<mat-chip-set role="list">` + `<mat-chip role="listitem">` (not interactive).
- Selection: `<mat-chip-listbox [multiple]="true" aria-label="...">` + `<mat-chip-option>`
  (`selected`, `selectable`, `disabled`); `hideSingleSelectionIndicator` (hurts a11y).
- Input: `<mat-chip-grid #grid aria-label="...">` + `<mat-chip-row (removed)="...">` and a
  sibling `<input [matChipInputFor]="grid" (matChipInputTokenEnd)="add($event)" aria-label="...">`
  inside `mat-form-field`; `editable` on rows. Global: `MAT_CHIPS_DEFAULT_OPTIONS`
  (`separatorKeyCodes`). Works with Signal Forms, `FormsModule`, `ReactiveFormsModule`.
- Icons: `matChipAvatar`, `matChipLeadingIcon` (leading icon support improved in 22.3),
  `matChipTrailingIcon`, `<button matChipRemove aria-label="Remove X">`.
- Vertical: class `mat-mdc-chip-set-stacked` on the container (documented).
- Tokens (`mat.chips-overrides`, keys without `chip-`): `container-height`,
  `container-shape-radius`, `outline-color`, `outline-width`, `label-text-color`,
  `selected-label-text-color`, `elevated-container-color`, `elevated-selected-container-color`,
  `with-icon-icon-color`, `with-icon-selected-icon-color`, `focus-outline-color`.
- A11y: label listbox/grid; `matChipRemove` only on `<button>`; no controls inside
  `mat-chip-option`; editable chips need `aria-description` with keyboard instructions.
- Harnesses: `MatChipListboxHarness` (`getChips`, `selectChips`, `isMultiple`),
  `MatChipOptionHarness` (`select`, `deselect`, `toggle`, `isSelected`), `MatChipGridHarness`
  (`getRows`, `getInput`), `MatChipRowHarness`, `MatChipHarness` (`getText`, `remove`,
  `getRemoveButton`, `getLeadingIcon`), `MatChipInputHarness`, `MatChipSetHarness`.

## Progress bar (`MatProgressBar`)

- `<mat-progress-bar mode="indeterminate" aria-label="Loading employees" />`; `mode`:
  `'determinate'` (default, `value` 0-100) | `'indeterminate'` | `'buffer'` (`bufferValue`) |
  `'query'`.
- Tokens (`mat.progress-bar-overrides`): `active-indicator-color`, `active-indicator-height`,
  `track-color`, `track-height`, `track-shape`.
- A11y: `role="progressbar"`; always `aria-label`/`aria-labelledby`; keep valuemin/max 0/100.
- Harness: `MatProgressBarHarness` (`getMode`, `getValue`).

## Card (`MatCardModule`)

- `<mat-card appearance="outlined">`; `MatCardAppearance = 'outlined' | 'raised' | 'filled'`.
  Sections: `mat-card-header`, `mat-card-title`, `mat-card-subtitle`, `mat-card-title-group`,
  `img mat-card-avatar`, `img mat-card-image`, `mat-card-content`,
  `mat-card-actions [align]="'start'|'end'"`, `mat-card-footer`. `<mat-card>` has no padding
  itself; the sections add it.
- Tokens (`mat.card-overrides`): `elevated-container-color/-shape/-elevation`,
  `outlined-container-color/-shape`, `outlined-outline-color`, `outlined-outline-width`,
  `filled-container-color/-shape`, `title-text-size/-font/-weight`, `subtitle-text-color/-size`.
- A11y: decorative container needs no role; meaningful grouping -> `role="group"`, `region` or a
  landmark; `tabindex` only if the card itself is interactive.
- Harness: `MatCardHarness` (`getTitleText`, `getSubtitleText`, `getText`).

## Button (`MatButton`, `MatIconButton`, `MatFab`, `MatMiniFab`)

- `matButton` appearances: `text` (default), `filled`, `tonal`, `outlined`, `elevated`.
  `matIconButton`, `matFab` (`extended`), `matMiniFab`. Icons before label by default,
  `iconPositionEnd` after; custom icon element needs `matButtonIcon`.
- `disabledInteractive` (focusable, `aria-disabled`; guard actions yourself). Global
  `MAT_BUTTON_CONFIG`. v22.0: `[showProgress]` + projected `progressIndicator` element
  (e.g. `<mat-progress-spinner progressIndicator mode="indeterminate" diameter="20"
  aria-label="Saving" tabindex="">`).
- Tokens (`mat.button-overrides`): prefixed per appearance: `filled-*`, `tonal-*`,
  `outlined-*`, `text-*`, `protected-*` (= `elevated` appearance), e.g.
  `filled-container-color`, `filled-container-shape`, `outlined-outline-color`,
  `text-label-text-color`. Icon buttons / FABs: `mat.icon-button-overrides`, `mat.fab-overrides`.
- A11y: `<button>` for actions, `<a>` for navigation; icon-only needs `aria-label`; 48x48 touch
  target; no ALL CAPS text.
- Harness: `MatButtonHarness.with({text})` (`click`, `getText`, `isDisabled`, `focus`).
