# Source and provenance

Retrieved: 2026-11-22. Version: `@angular/material` / `@angular/cdk` **22.3.0** (npm dist-tag
`latest` = 22.3.0, `next` = 22.4.0-next.0; GitHub release `v22.3.0` "nitrogen-nail", 2026-11-18).

material.angular.dev is a client-rendered SPA; a plain fetch returns only the page title. All
content was therefore read from the docs' sources in `angular/components` at tag `v22.3.0`
(the site renders these Markdown files and API goldens). All text in `SKILL.md` and
`references/` is condensed / own wording unless quoted.

## Sources

| Docs URL | Source file read (`https://raw.githubusercontent.com/angular/components/v22.3.0/...`) |
|---|---|
| https://material.angular.dev/guide/theming | `guides/theming.md` |
| https://material.angular.dev/guide/theming-your-components | `guides/theming-your-components.md` |
| /guide/system-variables, /guide/typography, /guide/elevation | Redirects (see `docs/src/app/routes.ts`): system-variables -> theming-your-components; typography, elevation -> theming. Content is in the two guides above. |
| https://material.angular.dev/guide/getting-started | `guides/getting-started.md`, `src/material/schematics/ng-add/theming/create-theme.ts` |
| https://material.angular.dev/guide/using-component-harnesses | `guides/using-component-harnesses.md` (CDK harness docs moved to angular.dev `/guide/testing/component-harnesses-overview`) |
| https://material.angular.dev/cdk/a11y | `src/cdk/a11y/a11y.md`, `goldens/cdk/a11y/index.api.md` |
| Component Overview/Accessibility tabs | `src/material/{tabs,table,sort,form-field,input,dialog,snack-bar,chips,progress-bar,card,button}/<c>.md` |
| Component API tabs | `goldens/material/<c>/index.api.md`, `goldens/material/<c>/testing/index.api.md`, `goldens/cdk/testing/testbed/index.api.md` |
| Component Styling tabs | `src/material/<c>/_m3-*.scss` (token maps), `src/material/<c>/_<c>-theme.scss` (`_define-overrides`, prefix stripping), `src/material/core/tokens/_token-utils.scss` |
| Sass API surface | `src/material/_index.scss`, `src/material/core/tokens/_classes.scss` (utility classes), `src/material/core/theming/_typography.scss` (typography mixins) |
| Examples used to check snippets | `src/components-examples/material/{table/table-sorting,table/table-filtering,dialog/dialog-harness,button/button-progress-indicator}` |
| Custom palettes | `src/material/schematics/ng-generate/theme-color/README.md` |
| Changelog 22.x | `CHANGELOG.md` (22.0.0 .. 22.3.0) |

## Official MCP / agent skill check (2026-11-22)

- No Angular Material-specific MCP server or agent skill exists (none in `angular/components`,
  none listed in `angular/skills`).
- Related official tools: Angular CLI MCP server (`npx @angular/cli mcp`; `search_documentation`
  searches angular.dev, not material.angular.dev) and `github.com/angular/skills`
  (`angular-developer`, `angular-new-app`; only `component-harnesses.md` touches Material).
  Both are already set up in this workspace (`.mcp.json`, `.claude/skills/angular-best-practices`).
- Community skills exist (e.g. on claudemarketplaces.com); not official, not used.

## Verified details / known docs inconsistencies

- `guides/theming.md` uses class `mat-border-variant` and the M2 section of
  `theming-your-components.md` uses `mat-font-body-medium`; neither exists in `_classes.scss`
  (actual: `mat-border-subtle`, `mat-font-body-md`).
- `form-field.md` still refers to `mat.form-field-theme` with `$color-variant` and an anchor
  `#using-component-color-variants` that no longer exists in the theming guide; not used here.
- Input docs mix `matInput` and `matNativeControl`; the 22.3 directive selector accepts both
  on `input`/`textarea`.
- `color` input: source JSDoc says M2 themes only, no effect in M3.

## Unverified / not checked

- Runtime behaviour was not tested (no build run); snippets are checked against API goldens and
  official examples only.
- `bindings` dialog option: confirmed in API golden and dialog spec (`inputBinding`); no guide
  text exists yet.
- WCAG contrast of the prebuilt palettes was not measured; the theme-color README only states
  generated palettes are "optimized to have enough contrast".

## How to update

1. `npm view @angular/material dist-tags` -> new version `X.Y.Z`.
2. Download the tree: `https://api.github.com/repos/angular/components/git/trees/vX.Y.Z?recursive=1`;
   re-read the files in the table above from `raw.githubusercontent.com/angular/components/vX.Y.Z/`.
3. Check `docs/src/app/routes.ts` and `docs/src/app/shared/guide-items/guide-items.ts` for moved
   or new guides.
4. Diff `_classes.scss`, `_index.scss` and the `_m3-*.scss` token maps; update token lists.
5. Read `CHANGELOG.md` entries since 22.3.0 (breaking changes, feat for listed components).
6. Recheck for an official Material MCP / skill (`angular/skills`, angular.dev `/ai`).
7. Update version and date here and in `SKILL.md`.
