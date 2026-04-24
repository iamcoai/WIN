---
name: win-deploy-check
description: Runs the full pre-deploy checklist for the WIN website — build, lint, broken anchor detection, missing section audit, and a git-status summary. Use this skill before every push to main, before creating a Vercel deployment, or whenever Chris says "klaar om te deployen", "check voor deploy", "ready to ship", or similar. Also use when Chris asks for a "deploy-readiness snapshot" or wants to verify the site is green before going live.
disable-model-invocation: false
allowed-tools: Bash(cd /Users/christianbleeker/Desktop/WIN/web && npm run build) Bash(cd /Users/christianbleeker/Desktop/WIN/web && npm run lint) Bash(cd /Users/christianbleeker/Desktop/WIN/web && npx tsc *) Bash(git status*) Bash(git diff --stat*) Bash(grep*) Bash(rg*) Read Glob
---

# WIN — Pre-deploy check

Runs the full pre-deploy gauntlet for the WIN website. Report results as a clear punch list: what's green, what's broken, what to fix before pushing.

## Workflow

Copy this checklist and tick items as you complete them:

```
Pre-deploy progress:
- [ ] Step 1: Build passes
- [ ] Step 2: Lint is clean
- [ ] Step 3: TypeScript has no errors
- [ ] Step 4: No broken anchors (href="#..." referenced but section missing)
- [ ] Step 5: Git status review
- [ ] Step 6: Summary & go/no-go
```

**Run steps 1-3 in parallel (they don't depend on each other).** Steps 4-5 can also run in parallel while the build completes.

### Step 1 — Build

```bash
cd /Users/christianbleeker/Desktop/WIN/web && npm run build 2>&1 | tail -40
```

Pass: exit 0, "Compiled successfully", all pages prerendered.
Fail: any "Failed to compile", "Error:", non-zero exit.

### Step 2 — Lint

```bash
cd /Users/christianbleeker/Desktop/WIN/web && npm run lint 2>&1 | tail -20
```

Pass: no warnings or errors in output.

### Step 3 — TypeScript

```bash
cd /Users/christianbleeker/Desktop/WIN/web && npx tsc --noEmit 2>&1 | tail -20
```

Pass: empty output (no errors).

### Step 4 — Broken anchors

Every `href="#..."` on the site must point to a real `id="..."` or the link goes nowhere — a classic WIN bug (the "Gratis Kennismaking" nav button points to `#kennismaking` which may not exist yet).

```bash
rg 'href="#[a-z-]+"' /Users/christianbleeker/Desktop/WIN/web/src --only-matching -N | sort -u
rg 'id="[a-z-]+"' /Users/christianbleeker/Desktop/WIN/web/src --only-matching -N | sort -u
```

Diff the two lists. Every `href="#X"` needs a matching `id="X"` somewhere on the target page. Report the mismatches explicitly.

### Step 5 — Git status

```bash
git -C /Users/christianbleeker/Desktop/WIN status --short
git -C /Users/christianbleeker/Desktop/WIN diff --stat HEAD
```

Flag: uncommitted files that should probably be in the deploy, or large unexpected diffs.

### Step 6 — Report

Produce a final table like this:

| Check | Status | Notes |
|---|---|---|
| Build | ✅ / ❌ | error summary if fail |
| Lint | ✅ / ❌ | |
| TypeScript | ✅ / ❌ | |
| Anchors | ✅ / ❌ | list dead anchors if any |
| Git status | ℹ️ | uncommitted files, branch ahead/behind |

Then a single line: **GO** (all green) or **NO-GO** (one or more ❌, fix these first).

## Rules

- Always run from `/Users/christianbleeker/Desktop/WIN/web` for npm commands (root has no package.json for the site).
- Don't auto-fix findings — report them. Chris decides what to patch.
- If the build takes over 2 minutes, don't assume it's hung; wait.
- Never run `git push` or `git commit` from this skill. This is read-only inspection.

## Integratie met G-Stack

Dit is de **WIN-specifieke** pre-flight check. Nadat deze groen is, wissel naar de gstack deploy-flow:

1. `/win-deploy-check` (hier) — WIN-specifieke audit (anchors, sections, Next.js 16 build)
2. `/ship` — run full test suite, bump VERSION, update CHANGELOG, open PR
3. `/land-and-deploy` — merge PR, wacht op Vercel CI, verifieer productie
4. `/canary` — post-deploy monitoring voor console errors / perf regressies

Voor de allereerste Vercel-setup: draai ook `/setup-deploy` eenmalig (detecteert platform en health-endpoints).
