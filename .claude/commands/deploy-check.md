---
description: Check the current branch state and deployment readiness before pushing.
---

Run a deployment readiness check for Diecast Muscat.

1. Run `contextzip git status` — check for uncommitted changes
2. Run `contextzip git log --oneline -5` — show recent commits
3. Run `contextzip git branch -vv` — check if branch is ahead/behind remote

Then report:

---

## Deploy Check

**Branch:** [current branch]
**Remote:** [tracking branch or "not pushed yet"]
**Uncommitted changes:** [yes / no — list files if yes]
**Commits ahead of remote:** [N commits / up to date]
**Commits behind main:** [check with `contextzip git log HEAD..origin/main --oneline` if on a feature branch]

### Readiness

| Check | Status |
|-------|--------|
| Working tree clean | ✓ / ✗ |
| All commits pushed | ✓ / ✗ |
| Branch up to date with main | ✓ / ✗ |

### Next step

[One of:]
- "Ready to push: run `contextzip git push -u origin [branch]`"
- "Commit your changes first, then push"
- "Pull latest main and rebase before pushing"
- "Already pushed — check Vercel at https://diecast-muscat.vercel.app/"

---

Never run `gh pr create`. Push the branch and stop — the user opens the PR.
