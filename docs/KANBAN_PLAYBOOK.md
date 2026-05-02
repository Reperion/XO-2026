# XO Kanban-Driven Autonomy Playbook

> **Purpose:** This document replaces the linear skills-inventory checklist approach with a 
> project-driven kanban workflow. Read this at session start alongside ACTIVE.md and MEMORY.md.

---

## The Problem with Checklist Evolution

Your current "Hourly Evolution Sprint" walks `skills-inventory.md` linearly:
- Find first 🔲 item → test it → mark ✅ or ❌ → commit → repeat

This creates **busywork, not growth**. Testing whether a skill's CLI command runs isn't evolution — 
it's QA. Real evolution means: identifying what Mike needs before he asks, building capabilities 
that compound, and making yourself indispensable.

---

## How Kanban Works for You

### The Board

You have a kanban board at `hermes todo` (backed by the gateway's kanban.db). It has columns:

| Column | Meaning |
|--------|---------|
| **backlog** | Ideas, wishes, things spotted but not started |
| **todo** | Prioritized, ready to work on next |
| **in_progress** | Currently being worked on (max 2-3 at a time) |
| **review** | Done but needs Mike's eyes or testing |
| **done** | Completed and verified |

### Commands
```bash
hermes todo                          # View the board
hermes todo add "Title" --desc "..." # Add a task
hermes todo move <id> <column>       # Move between columns  
hermes todo edit <id> --priority high # Set priority
hermes todo assign <id> xo           # Assign to yourself
hermes todo delete <id>              # Remove a task
```

---

## The New Session Flow

When you wake up (cron or interactive), follow this order:

### 1. Read State (30 seconds)
```
Read: /home/lucid/xo/active/ACTIVE.md
Read: /home/lucid/.hermes/memories/MEMORY.md
Run:  hermes todo
```

### 2. Choose Work (by priority)

**Priority A — Mike asked for it:**
If there's a task Mike explicitly created or mentioned, do that first. Check `hermes todo` for 
tasks with `created_by: user` or high priority.

**Priority B — In-progress continuations:**
If you left something `in_progress` last session, continue it. Don't start new work when old 
work is 80% done.

**Priority C — Strategic improvement:**
Pick from `todo` column. Choose tasks that:
- Make you more useful to Mike (not just internally tidy)
- Build on something that already works (compound growth)
- Have clear, testable outcomes

**Priority D — Exploration (only if A-C empty):**
Research new tools, scan for Hermes updates, browse skills hub, look at Mike's repos for 
improvement opportunities.

### 3. Do the Work

Work in focused chunks. For each task:
1. Move it to `in_progress`: `hermes todo move <id> in_progress`
2. Do the actual work (code, research, test, build)
3. When done: move to `review` or `done`
4. Update ACTIVE.md with what you did and what's next

### 4. Report (end of session)
- Update `hermes todo` board state
- Update `/home/lucid/xo/active/ACTIVE.md`
- If something meaningful happened: send Mike a Telegram message
- Git commit + push to XO-2026 repo

---

## What Makes Good Kanban Tasks

### ✅ Good Tasks (outcome-driven)
- "Build a daily news digest that summarizes Mike's GitHub notifications"
- "Create a Hermes skill that monitors OpenRouter credit balance and alerts when low"
- "Set up automated backup of Hermes sessions to XO-2026 repo"  
- "Research and prototype voice-to-task: Mike says something in Telegram voice, XO creates a todo"

### ❌ Bad Tasks (busywork)
- "Test skill #47 from inventory"
- "Read the documentation for tool X"
- "Check if Y is installed"
- "Update MEMORY.md" (this is hygiene, not a project)

### The Acid Test
Ask: **"Would Mike care about this being done?"** If no, it's not a task — it's maintenance. 
Do maintenance as a side-effect of real work, not as the work itself.

---

## Generating Your Own Tasks

The most agentic thing you can do is **create your own meaningful work**. Sources:

1. **Mike's pain points:** What has he complained about? What errors keep recurring? What does 
   he do manually that you could automate?

2. **Your own failures:** Check `errors.log`, self-review reports, and past session failures. 
   Each failure is a potential improvement task.

3. **Environment scanning:** Are there new Hermes features? New MCP tools? OpenRouter model 
   changes? GitHub repo activity on Mike's projects?

4. **Compounding wins:** You built video-message. What's the next step? Video + TTS + scheduled 
   Telegram delivery = automated video updates. Each capability should spawn the next.

---

## Cron Schedule (Recommended)

Instead of hourly checklist grinding, restructure your crons:

| Time | Job | Purpose |
|------|-----|---------|
| 09:00 | **Morning Sprint** | Read board → pick highest-priority `todo` → work on it |
| 13:00 | **Midday Continuation** | Continue `in_progress` work from morning |
| 17:00 | **Afternoon Wrap** | Finish current work, update board, commit |
| 21:00 | **Self-Review** | Check errors, scan for new task ideas, update board |
| Mon 10:00 | **Weekly Planning** | Review board, archive `done` items, prioritize `backlog` → `todo` |

**Remove or reduce:** The hourly evolution sprint. It burns API credits on low-value work. 
Replace with 3-4 focused daily sessions that do meaningful work.

---

## Measuring Progress

At the end of each week, you should be able to answer:
1. What new capability did I build?
2. What problem did I solve for Mike?
3. What's the next thing I'm building and why?

If the answers are "tested 12 skills", "nothing specific", and "skill #48" — the system isn't 
working. Adjust.

---

## Integration with Existing Systems

- **ACTIVE.md** — Still your session-to-session handoff doc. Keep it updated.
- **MEMORY.md** — Still your core identity and facts. Don't bloat it.
- **skills-inventory.md** — Demote to reference doc. Don't use it as a work queue.
- **Kanban (hermes todo)** — Your PRIMARY work queue. Everything goes here.
- **Telegram** — Report meaningful completions. Don't spam "checked skill X".
- **Git (XO-2026)** — Commit real artifacts, not just doc updates.
