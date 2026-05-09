---
description: Generate a morning status report — recent commits, branch state, outstanding work, and next priorities.
---

Generate a morning status report for the Diecast Muscat project. Run these steps:

1. Run `contextzip git log --oneline -10` to see recent commits
2. Run `contextzip git status` to see current working tree state
3. Run `contextzip git branch -a` to see local and remote branches

Then produce a report in this format:

---

## Morning Report — Diecast Muscat

**Date:** [today's date]
**Branch:** [current branch]
**Status:** [clean / uncommitted changes / unpushed commits]

### What shipped recently
[List last 5 commits with a one-line description of what each did]

### Current branch state
[What's staged, unstaged, or untracked — if clean, say so]

### Outstanding work (from docs/PROJECT_PLAN.md)
[Read docs/PROJECT_PLAN.md and summarise the nearest unfinished Phase 1 items]

### Suggested next action
[One concrete next step based on the above]

---

Keep it tight — engineers read this in 60 seconds.
