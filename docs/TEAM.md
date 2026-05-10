# Cosmetic Website — Team Roles & Responsibilities

## Team Structure

```
Project Manager / Team Lead
├── Frontend Developer
├── Backend Developer
├── QA Engineer (Unit Test)
└── QA Engineer (Manual Test + Documentation)
```

---

## Role Definitions

### Team Lead / Architect
**Responsibilities:**
- Define technical requirements and architecture
- Define and enforce development & testing policy
- Code review for all pull requests
- Final approval before release
- Resolve technical blockers

**Owns:**
- `docs/REQUIREMENTS.md`
- `docs/STRUCTURE.md`
- `docs/CONFIG.md`
- `CONTRIBUTING.md`

---

### Frontend Developer
**Responsibilities:**
- Build and maintain Vue.js components
- Implement UI based on design (Rose Gold theme)
- Wire API calls via axios
- Implement i18n (TH/EN) for all UI text
- Fix frontend bugs reported by QA

**Owns:**
- `frontend/src/components/`
- `frontend/src/views/`
- `frontend/src/stores/`
- `frontend/src/assets/styles/`

---

### Backend Developer
**Responsibilities:**
- Build and maintain Express.js REST API
- Design and manage MySQL schema
- Implement JWT authentication
- Handle file upload logic (Multer)
- Fix backend bugs reported by QA

**Owns:**
- `backend/src/`
- `database/schema.sql`

---

### QA Engineer — Unit Test
**Responsibilities:**
- Write and maintain unit tests for backend API (Jest + Supertest)
- Write and maintain unit tests for frontend components (Vitest + Vue Test Utils)
- Run test suite on every code change — all tests must pass before PR review
- Report failing tests to the responsible developer
- Maintain minimum test coverage of 70% (target 80%)

**Owns:**
- `backend/tests/`
- `frontend/src/__tests__/`

**Tools:**
| Tool | Purpose |
|------|---------|
| Jest | Backend unit test runner |
| Supertest | HTTP API testing |
| Vitest | Frontend unit test runner |
| @vue/test-utils | Vue component testing |

---

### QA Engineer — Manual Test + Documentation
**Responsibilities:**
- Execute manual test cases from `MANUAL_TEST_CASES.md`
- Run automated screenshot pipeline before each test cycle
- Review and verify screenshots for each test case
- Fill in `TEST_REPORT_TEMPLATE.md` for each test cycle
- Report bugs with screenshot evidence
- Verify bug fixes before marking as resolved
- Keep user manuals (TH/EN) up to date after each release

**Owns:**
- `docs/testing/MANUAL_TEST_CASES.md`
- `docs/testing/TEST_REPORT_TEMPLATE.md`
- `docs/testing/screenshots/`
- `docs/Cosmetic_User_Manual.docx`
- `docs/คู่มือการใช้งาน_Cosmetic.docx`

**Tools:**
| Tool | Purpose |
|------|---------|
| Puppeteer | Automated headless Chrome screenshot capture |
| `npm run screenshot` | Runs 48 TC screenshots in one command |
| `node generate-manual.js` | Rebuilds English Word manual |
| `node generate-manual-th.js` | Rebuilds Thai Word manual |
| Browser DevTools | Inspect errors, network calls |
| Markdown editor | Fill test reports |

---

## Testing Workflow

```
Developer makes change
    │
    ▼
npm test                      ← all unit tests must be GREEN (no exceptions)
    │
    ▼
npm run screenshot            ← capture 48 TC screenshots, review visually
    │
    ▼
Team Lead code review         ← approve or request changes
    │
    ▼
QA Manual executes test cases ← step-by-step with screenshots
    │
    ▼
Fill TEST_REPORT.md           ← document pass/fail + screenshots
    │
    ├── All pass → node generate-manual-th.js + generate-manual.js → Release
    └── Any fail → Bug report → Developer fix → Re-test from top
```

> Full policy details in `CONTRIBUTING.md` at the project root.

---

## Bug Report Format

When a manual tester finds a bug, report it using this format:

```
BUG-001
Title    : [Short description]
Severity : Critical / High / Medium / Low
Found by : [Tester name]
Date     : YYYY-MM-DD
Section  : [Banner / Product / Contact / Admin / Login]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result: ...
Actual Result  : ...
Screenshot     : screenshots/BUG-001.png
```

---

## Severity Levels

| Level | Definition | Example |
|-------|-----------|---------|
| Critical | Site completely broken or data loss | Login fails, products not loading |
| High | Major feature broken | Image upload fails, contact form not submitting |
| Medium | Feature works but incorrect behavior | Wrong language shown, price not displaying |
| Low | Minor UI issue | Spacing off, color slightly wrong |
