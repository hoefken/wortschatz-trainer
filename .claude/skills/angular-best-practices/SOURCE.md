# Source and provenance

Retrieved: 2026-11-22. Angular version: v22.3.0 (angular.dev footer "Built by Angular at
v22.3.0+sha-da7ec7b"; npm `@angular/cli` dist-tag `latest` = 22.3.0, `next` = 22.3.0-rc.0).

## Sources

| URL | Used for | Treatment |
|---|---|---|
| https://angular.dev/ai/develop-with-ai | Overview of rules files, llms.txt, best-practices file | read |
| https://angular.dev/assets/context/best-practices.md | Official system instructions | verbatim in `SKILL.md` section "Official best practices" and `references/official/best-practices.md` |
| https://angular.dev/assets/context/guidelines.md | Copilot / VS Code rules file | verbatim `references/official/guidelines.md` |
| https://angular.dev/assets/context/llms-full.txt | Stability checks (experimental / developer preview), zoneless, Vitest, HttpClient defaults | read, condensed |
| https://angular.dev/ai/mcp | Angular CLI MCP server setup, flags, tools | read, condensed |
| https://angular.dev/ai/agent-skills | Official agent skills | read |
| https://github.com/angular/skills (branch `main`, commit 97c663a0, BUILD_INFO 2026-11-20, built from angular/angular 8b15295e) | Official `angular-developer` and `angular-new-app` skills | verbatim under `references/official/` |
| https://raw.githubusercontent.com/angular/angular/main/LICENSE | MIT licence text | verbatim `references/official/LICENSE` |
| https://angular.dev/style-guide | Naming, structure, component member rules | condensed in `SKILL.md` |
| https://angular.dev/guide/signals/resource | resource stability | read |
| `@angular/cli@22.3.0` npm tarball (`lib/cli-*.js`, MCP command) | MCP flags, stable and experimental tool lists | inspected |

## Verbatim vs. condensed

- Verbatim (unchanged content): `references/official/**`, and the "Official best practices" block in
  `SKILL.md` (headings demoted one level, otherwise identical).
- Renamed only: official `SKILL.md` files are stored as `SKILL.official.md` so Claude Code does not
  load them as separate skills; the angular/skills `README.md` is `README.angular-skills.md`.
- Condensed / own wording: "Workspace rules" and "Condensed additions" in `SKILL.md`.
- Not copied: `references/angular-22-features.md` (maintained separately).

## Licence

Official skills carry `license: MIT`, `author: Copyright 2026 Google LLC` in their frontmatter. The
angular/skills repo has no LICENSE file; it is generated from `skills/dev-skills/` in angular/angular,
which is MIT (copy in `references/official/LICENSE`). angular.dev docs content is CC BY 4.0 per the
site footer.

## MCP facts verified in `@angular/cli@22.3.0`

- Command: `npx -y @angular/cli mcp` (docs). Options: `--read-only`, `--local-only`, `--root <path>`
  (repeatable), hidden `--experimental-tool`/`-E <name>` (groups `all`, `devserver`).
- Stable tools: `ai_tutor`, `get_best_practices`, `search_documentation` (needs internet),
  `list_projects`, `onpush_zoneless_migration`, `run_target`, `devserver_start`, `devserver_stop`,
  `devserver_wait_for_build`.
- Experimental tools: none (`EXPERIMENTAL_TOOLS = []`). `find_examples` does not exist in 22.3.0.

## How to update

1. Check the current version at https://angular.dev (footer) and `npm view @angular/cli dist-tags`.
2. Re-download `best-practices.md` and `guidelines.md` from https://angular.dev/assets/context/ and
   replace the verbatim block in `SKILL.md` and the files in `references/official/`.
3. Download https://codeload.github.com/angular/skills/tar.gz/refs/heads/main, replace
   `references/official/angular-developer/` and `angular-new-app/` (keep the `SKILL.official.md`
   rename), update commit and BUILD_INFO date above.
4. Recheck stability notes: `grep -nE "developer preview|experimental" llms-full.txt`.
5. Recheck MCP tools in the CLI bundle (`STABLE_TOOLS`, `EXPERIMENTAL_TOOLS`) or `ng mcp --help`.
6. Update the version line and date in `SKILL.md` and this file.
