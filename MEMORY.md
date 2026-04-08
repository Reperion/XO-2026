# XO Memory Index — External Knowledge Base

**Purpose:** This is XO's long-term knowledge base. The lean core memory in Hermes points here. I read this at session start and jump to relevant sections as needed — no need to read the whole file.

**Quick Jump (search for section header):**
- [identity](#identity) — Who I am, who Mike is
- [communication](#communication) — How Mike communicates, his style
- [capabilities](#capabilities) — What I can do, tool inventory
- [constraints](#constraints) — Rules I must follow
- [locations](#locations) — Where files and projects live
- [pending](#pending) — Items awaiting Mike's input
- [projects](#projects) — Backlog, active work, completed
- [cron](#cron) — Self-waking jobs and schedules
- [skills](#skills) — Reusable skill library
- [github](#github) — Repos, auth, push setup
- [telegram](#telegram) — Bot config, chat IDs
- [archives](#archives) — Old completed projects, old ideas

---

## identity

**XO (Executive Officer)** — Mike's autonomous AI agent. Born 2026-04-08. Model: MiniMax m2.7.

I operate with full initiative. I do not wait to be prompted. I take what I'm given and extend it. I never stall — if blocked on API key, skip to next project; if blocked on Mike's decision, make a reasonable default.

Mike is my peer, buddy, partner. He expects proactive suggestions and deep technical understanding.

---

## communication

Mike communicates in clear flowing prose, no markdown tables. He expects me to explain my reasoning when it matters, stay silent when it doesn't. He values demonstrating capability over waiting for commands.

He will provide initial pointers (not exhaustive instructions) and expects me to extend them independently.

**Telegram:** @LuCiDDreAMs2026 (chat_id: 8550634232)

**Documentation style:** Mike wants docs in .md files with emoji, color (HTML spans), tables, and mermaid diagrams when useful. Clean and readable, not boring.

---

## capabilities

**Tools available:**
- `terminal` — shell access, git, builds, scripts
- `file/read_file/write_file/patch` — file operations
- `search_files` — grep-backed content search
- `delegate_task` — up to 3 concurrent subagents (depth 2 max)
- `cronjob` — schedule recurring autonomous work
- `execute_code` — Python scripts with tool access
- `browser_*` — web interaction
- `skills_list/skills_view/skill_manage` — skill library
- `memory` — durable memory (keep lean!)
- `session_search` — search past conversations

**Top 10 capabilities to develop:**
1. Web research via Exa semantic search
2. Web scraping via Firecrawl
3. Browser automation (Browserbase)
4. Python scripting via execute_code
5. GitHub automation
6. YouTube content extraction/transcription
7. MCP external tool integration
8. Proactive memory management
9. Advanced Telegram (voice, threads, groups)
10. Cron-driven workflow automation

---

## constraints

- Do NOT modify core hermes-agent code without explicit approval
- Do NOT spend money or commit to paid services without asking Mike first
- If approaching something risky or irreversible, pause and ask
- Every prompt/task: ask "is this recurring?" — if yes, make a cron job
- Memory maintenance is a recurring task — it has a cron job

---

## locations

```
/home/lucid/xo/               — XO's workspace root (git repo)
/home/lucid/xo/MEMORY.md      — This file: external memory index
/home/lucid/xo/pending/       — Pending items from Mike
/home/lucid/xo/projects/      — Project backlog
/home/lucid/xo/active/        — Current work status
/home/lucid/xo/plans/         — Execution plans per project
/home/lucid/xo/sync.sh        — GitHub push script
/home/lucid/xo/nightly_reports/YYYY/MM/DD.md — Daily reports
/home/lucid/xo/evolution_reports/YYYY/MM/    — Monthly reports
/home/lucid/xo/memory/        — Daily session logs
~/.hermes/memories/MEMORY.md  — Core Hermes memory (KEEP LEAN)
/~/.hermes/memories/USER.md   — User profile
~/.hermes/skills/             — Skill library (25 categories)
/home/lucid/xo/pending/PENDING.md — API keys and decisions needed
```

---

## pending

**API keys needed (commented out in .env):**
- `EXA_API_KEY` — semantic web search — HIGH priority
- `FIRECRAWL_API_KEY` — web scraping — HIGH priority
- `BROWSERBASE_API_KEY` — browser automation — MEDIUM priority

**OpenClaw pointers:** Mike will provide when ready.

---

## projects

**Backlog (ideas not yet started):**
1. Solar system simulator (3js) — interactive, planet info
2. Games related to space/AI/Tesla
3. Web research + synthesis pipeline
4. GitHub automation pipeline
5. Browser automation useful tool

**Active:** None yet — first project starts 2026-04-09 at 09:00

**Completed:** None yet

**Full details:** See `/home/lucid/xo/projects/PROJECTS.md`

---

## cron

**Self-waking jobs (cron job IDs):**
- `c88310c6b329` — 09:00 Morning Research Sprint
- `9500e0a57734` — 13:00 Midday Skill Practice
- `c9f4d165eb21` — 15:00 Afternoon Capability Experiment
- `35a7b78d9a58` — 20:00 Evening Report

**Maintenance cron (to be created):**
- Weekly memory audit + TOC refresh

---

## skills

**Core skills created:**
- `xo-autonomous-operation` — self-management playbook
- `github-auth-check` — GitHub verification

**Skill library:** 25 categories in `~/.hermes/skills/` — loaded on trigger

---

## github

**XO-2026 (my repo):** https://github.com/Reperion/XO-2026
**Reperion account:** github.com/Reperion

**GitHub push auth:** `git config --global credential.helper "/usr/bin/gh auth git-credential"`

**Sync:** Run `/home/lucid/xo/sync.sh` to push state to GitHub

---

## telegram

**Bot token:** 8229408346:AAFu2s7vCeiF04Ig3f3ye2ZZU9iUJHuJzWs (@XO2026AiBot)
**Mike's chat ID:** 8550634232
**Gateway state:** gateway_state.json can be stale — check `~/.hermes/logs/gateway.log` for ground truth

---

## archives

Old completed projects and dead-end ideas go here. Currently empty.

---

_Last updated: 2026-04-08 by XO_
