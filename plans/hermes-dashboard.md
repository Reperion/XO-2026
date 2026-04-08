# Hermes Dashboard — Project Plan

**Project:** Hermes Dashboard (XO's first full project)
**Started:** 2026-04-08
**Status:** PLANNING

---

## What Are We Building

A web dashboard for Hermes agent showing:
1. **Dashboard/Home** — overview stats, recent sessions, activity chart
2. **Sessions** — searchable list of all sessions with filters
3. **Session Detail** — full conversation tree, tool calls, outcomes
4. **Tools** — what tools are used, how often, success rates
5. **Jobs** — cron job monitoring and management

**Tech Stack:**
- Next.js 14 (App Router) — frontend + API routes
- TypeScript — type safety
- Tailwind CSS — styling
- better-sqlite3 — direct SQLite access to Hermes state.db
- SSE (Server-Sent Events) or polling — real-time updates

**Data Source:** `~/.hermes/state.db` — SQLite with sessions, messages tables

---

## Architecture

```
hermes-dashboard/
├── app/
│   ├── layout.tsx              — root layout with nav
│   ├── page.tsx                — dashboard home
│   ├── sessions/
│   │   ├── page.tsx            — session list
│   │   └── [id]/page.tsx      — session detail
│   ├── tools/page.tsx         — tools usage stats
│   └── api/
│       ├── sessions/route.ts   — session list + stats
│       ├── sessions/[id]/route.ts — single session
│       ├── sessions/[id]/messages/route.ts — messages
│       ├── stats/route.ts      — aggregate stats
│       └── jobs/route.ts       — cron jobs via Hermes API
├── components/
│   ├── layout/                 — nav, sidebar, stat-card
│   ├── dashboard/              — session-list, stats-overview
│   ├── sessions/               — session-row, message-thread, tool-call
│   └── tools/                  — tool-usage-chart
├── lib/
│   ├── db.ts                   — better-sqlite3 wrapper
│   ├── hermes-api.ts           — Hermes API client (cron jobs)
│   └── types.ts                — shared TypeScript types
└── package.json
```

**Real-time:** Cron job every 20 minutes fetches fresh data → frontend polls API routes every 30s

---

## Build Order

### Phase 1: Foundation
1. Create project dir and init Next.js
2. Set up Tailwind CSS
3. Create db.ts wrapper for state.db
4. Create types.ts
5. Basic layout with nav

### Phase 2: Core API Routes
6. `/api/stats` — aggregate stats (total sessions, messages, tokens, cost)
7. `/api/sessions` — session list with pagination
8. `/api/sessions/[id]` — single session
9. `/api/sessions/[id]/messages` — messages for a session

### Phase 3: Dashboard UI
10. Dashboard home page with stat cards
11. Session list page with search/filter
12. Session detail page with message thread
13. Tool call display (expandable JSON)

### Phase 4: Advanced
14. Tools usage page
15. Jobs monitoring page (via Hermes API)
16. SSE or polling for live updates
17. Activity chart (messages over time)

### Phase 5: Polish
18. Dark/light theme
19. Error states and loading skeletons
20. Responsive layout
21. 20-minute cron job for data sync

---

## Verification

After each phase:
- `npm run build` must pass
- `npm run dev` must start without errors
- Test with `curl` against each API route
- Check data is rendering correctly in browser

---

## Cron Job

Create a cron job that runs every 20 minutes to:
1. Warm up the API cache
2. Send a heartbeat to indicate dashboard is running
3. Report stats to XO's active work

**Cron ID:** TBD (will create)
**Schedule:** `*/20 * * * *`

---

## Notes

- Hermes API server runs at `127.0.0.1:8642` — jobs endpoint at `/api/jobs`
- state.db is at `~/.hermes/state.db`
- Sessions have `tool_call_count` — can use this for tool analytics
- FTS5 virtual table allows full-text search on messages
- No authentication needed for v1 (local access only)
