# Hermes Dashboard Evolution Plan (2026-04-08)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task with reviews.

**Goal:** Evolve MVP dashboard into production-grade: global search across data, interactive charts, XO project board integration, full Tailwind components (no inline styles), comprehensive tests, deploy-ready (Vercel).

**Architecture:** 
- Retain Next.js App Router + SQLite readonly queries.
- Add Recharts for viz (pie/line/bar on stats/tools/sessions).
- New /xo route: render Markdown from /home/lucid/xo/ files (PROJECTS/ACTIVE/PENDING/MEMORY).
- Global /api/search: FTS union messages/tools/jobs/sessions.
- Extract UI to /components/ui + /components/charts.
- Tailwind 4 full (replace all inline style=).
- Testing: Vitest (unit/components), Playwright (E2E/pages).
- Icons: Lucide React.
- Deploy: vercel.json + env H HERMES_DB_PATH.

**Tech Stack:** Next 16.2, Tailwind 4, Recharts^2.12, Lucide React, Vitest^2, Playwright^1.48, react-markdown for XO MD.

**Pre-reqs (run once):** 
```
cd /home/lucid/xo/hermes-dashboard
npm i recharts lucide-react react-markdown @types/react-markdown
npm i -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom playwright
npx playwright install
```

---

### Task 1: Extract Inline Styles → Tailwind Components
**Objective:** Ditch inline styles. Create reusable UI components with Tailwind classes.

**Files:**
- Create: components/ui/StatCard.tsx, components/ui/SessionRow.tsx, components/ui/ToolBar.tsx, components/ui/JobCard.tsx
- Modify: app/page.tsx, app/sessions/page.tsx, app/tools/page.tsx, app/jobs/page.tsx (replace <div style> with <StatCard /> etc.)
- Update: app/globals.css (Tailwind @apply utilities if needed)

**TDD Steps:**
1. `tests/components/ui/StatCard.test.tsx` — render/label/value test FAIL.
2. Run `npm test tests/components/ui/StatCard.test.tsx` verify FAIL.
3. Implement StatCard.tsx w/ Tailwind `bg-card p-6 rounded-lg border etc.`.
4. Test PASS + update page.tsx usages.
5. Full `npm test && npm run lint`.
6. Commit: git add . && git commit -m "refactor: extract Tailwind UI components (StatCard/SessionRow/ToolBar/JobCard)"

### Task 2: Global Search (/api/search + Overview Bar)
**Objective:** Search bar on / queries messages/tools/jobs/sessions.

**Files:**
- Create: app/api/search/route.ts (db union FTS/LIKE on content/tool_calls/job.prompt_preview)
- Modify: app/page.tsx (useState search, fetch /api/search?q=, show results accordion)

**TDD:** test/api/search.test.ts (q='tool' → results array).
Run pytest equiv `npm test`.
Integrate UI + responsive results list.
Commit: "feat: global search across data"

### Task 3: Recharts Visualizations
**Objective:** Charts on /: token pie (in/out), top tools bar, sessions/day line.

**Files:**
- Create: components/charts/TokenPie.tsx, ToolBarChart.tsx, SessionsLine.tsx
- Modify: app/page.tsx (<ChartsGrid> wrapping)

**TDD:** Component snapshot + data props tests.
Responsive + tooltips.
Commit: "feat: Recharts stats/tools/sessions viz"

### Task 4: /xo Project Board Page
**Objective:** New tab renders xo/ MD files live (PROJECTS/ACTIVE/PENDING/MEMORY).

**Files:**
- Create: app/xo/page.tsx + app/api/xo-files/route.ts (list xo/)
- Extend: lib/hermes-api.ts? Or terminal read_file calls.
- components/XoBoard.tsx (MDX/Markdown render, file switcher)

**TDD:** api/xo-files.test.ts (files array), page render test.
Use react-markdown + remark-gfm for tables.
Commit: "feat: XO project board integration (/xo)"

### Task 5: Full Tests + Deploy
**Objective:** Unit/E2E coverage + Vercel config.

**Files:**
- vitest.config.ts, playwright.config.ts
- tests/pages/Overview.test.tsx etc. (mount + data fetch mock)
- npx playwright test (smoke test pages)
- vercel.json (rewrites, env)

**Run:** `npm test -- --coverage`, `npx playwright test`.
Commit: "chore: full test suite + Vercel deploy config"

**Post:** `vercel --prod` (ask Mike for token if needed).

---

**Success Metrics:** 100% test pass, zero inline styles, charts interactive, /xo live MD, search <1s, responsive mobile.

_Last updated: 2026-04-08 by XO_