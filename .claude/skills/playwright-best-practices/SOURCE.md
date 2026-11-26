# Origin

- Upstream: https://github.com/currents-dev/playwright-best-practices-skill
- Revision: commit `283d5cbc5d11aac1abda058b16ad22c317d54dc0` (2026-07-21), version 1.2 per frontmatter
- License: MIT, see `LICENSE.md`
- Taken: content of `playwright-best-practices/` and `LICENSE.md`.

## Local changes

`SKILL.md` only: shortened frontmatter `description` and the section "Precedence in this workspace". All reference files are unchanged, so a diff against upstream shows the drift.

## Update

```bash
git clone --depth 1 https://github.com/currents-dev/playwright-best-practices-skill /tmp/pw-bp
diff -r /tmp/pw-bp/playwright-best-practices .claude/skills/playwright-best-practices
```
