# Contributing Guide — Cosmetic Website

## The Golden Rule

> **Every change must be tested. No exception.**

When you fix or add anything, you must prove it works and prove nothing else broke.

---

## Branching Strategy

```
main          ← production-ready only, no direct commits
  └─ develop  ← integration, always stable
       └─ feature/TC-XX-description   ← your work branch
       └─ fix/TC-XX-short-description
```

- Branch from `develop`, merge back to `develop` via Pull Request
- At least **1 reviewer approval** before merge
- Delete branch after merge

**Branch naming examples**
```
feature/TC-10-banner-management
fix/TC-09-login-error-message
docs/update-thai-manual
```

---

## Commit Format

```
type(scope): short description
```

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `refactor` | Code change, no behavior change |
| `chore` | Build, config, dependency update |

**Examples**
```
feat(admin): add banner edit form
fix(auth): correct wrong password error message
test(products): add unit test for category filter
docs: update Thai user manual with new screenshots
```

---

## Change → Test Flow

Follow this for **every** change before committing:

```
1.  Make your change
2.  npm test                 ← all unit tests must be GREEN
3.  npm run screenshot       ← capture new screenshots
4.  Review screenshots       ← visually confirm nothing broke
5.  Update manual if needed  ← node generate-manual-th.js
6.  git commit & open PR
```

### What to test per change type

| Change Type | Required Tests |
|-------------|---------------|
| Bug fix | Write a test that proves the bug is fixed |
| New feature | Unit test + manual screenshot |
| UI change | Run screenshot, check visually |
| API change | `npm test` — all backend tests green |
| Database change | Re-run seed script + check related APIs |
| Refactor | Full test suite — behavior must not change |

---

## Test Commands

```bash
# Run all unit tests (backend + frontend)
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test

# Seed test data (requires backend running)
npm run seed

# Capture all screenshots (requires both servers running)
npm run screenshot

# Full pipeline: seed + screenshot + generate English manual
npm run manual

# Generate Thai manual
node generate-manual-th.js

# Generate English manual
node generate-manual.js
```

---

## Bug Severity

| Level | Example | Action |
|-------|---------|--------|
| **P1 — Critical** | Login broken, data loss, site down | Fix same day |
| **P2 — High** | Feature not working, wrong data shown | Fix this sprint |
| **P3 — Low** | UI misalignment, typo, minor style | Next sprint |

P1 and P2 bugs **block release**. No deploy until resolved.

---

## Release Gate

Before any merge to `main`, all 3 must be true:

- [ ] All unit tests pass (`npm test` — 0 failures)
- [ ] Manual test screenshots updated and reviewed
- [ ] No open P1 or P2 bugs

---

## Code Standards

- **No `console.log`** in production code — use proper error handling
- **No secrets in code** — all credentials go in `.env` only, never committed
- **Validate all user input** at API boundaries before processing
- **ESLint must pass** — fix lint errors before committing
- **One PR per feature/fix** — keep changes focused and reviewable

---

## Minimum Test Coverage Target

| Layer | Target |
|-------|--------|
| Backend API routes | 70% |
| Frontend stores (Pinia) | 70% |
| Frontend components (critical) | Key user flows covered |

---

## Questions?

If unsure whether something needs a test — **it does.**  
If unsure how to write the test — ask the team lead before skipping it.
