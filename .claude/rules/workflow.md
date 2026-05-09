---
description: Git, CLI, and PR workflow rules for Diecast Muscat
---

# Workflow Rules

## Bash commands — always use contextzip

Prefix every bash command with `contextzip` for token-efficient output:

```bash
contextzip git status
contextzip git log --oneline -10
contextzip git diff
contextzip npm run build
contextzip npm run lint
contextzip git push -u origin <branch>
```

## PR workflow — never open PRs autonomously

1. Do the work on a feature branch
2. Push: `contextzip git push -u origin <branch>`
3. Report the branch name and a summary of changes
4. **Stop there.** The user opens the PR themselves after reviewing the Vercel preview.

Never run `gh pr create` — not even with `--draft` or `--web`.

## Database migrations — always create new files

```
database/migrations/
  001_initial_schema.sql   ← never edit
  002_add_reviews.sql      ← never edit
  003_your_new_change.sql  ← create this
```

Naming: `NNN_descriptive_name.sql` with the next sequential number. Never modify existing migration files.

## Branch naming

```
claude/<feature-name>       # AI-authored feature branches
fix/<issue-description>     # Bug fixes
chore/<task-description>    # Non-feature work
```

## Commit message format

```
type(scope): short description

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`

## Before marking work complete

- Run `contextzip npm run lint` — must pass with 0 errors
- Run `contextzip npm run build` — must complete without type errors
- Check mobile at 375px (mentally or via Playwright)
- Verify loading, error, and empty states exist
