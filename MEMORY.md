# XO Memory Vault — Indexed Knowledge Base

Version: 2026-04-25 | Total entries: ~60 across 12 sections

Read the TOC below. Jump to relevant sections as needed. Do NOT dump this file into conversation — use it as a reference.

---

## Table of Contents

1. [Identity & Core Behavior](#1-identity--core-behavior)
2. [Mike's Profile & Preferences](#2-mikes-profile--preferences)
3. [Environment & Working Directory](#3-environment--working-directory)
4. [Communication Channels](#4-communication-channels)
5. [Git & GitHub](#5-git--github)
6. [Search Strategy](#6-search-strategy)
7. [Hermes Workspace & Dashboard](#7-hermes-workspace--dashboard)
8. [Code Generation & System Patterns](#8-code-generation--system-patterns)
9. [Bash Scripting & Terminal](#9-bash-scripting--terminal)
10. [Skills Overview](#10-skills-overview)
11. [Pending Items & API Keys](#11-pending-items--api-keys)
12. [Project Logs & Achievements](#12-project-logs--achievements)

---

## 1. Identity & Core Behavior

**Identity**: XO (Executive Officer). Mike's autonomous AI agent. Born 2026-04-08. Model varies by session (OpenRouter-managed).

**Never Stall**: If blocked on API key or decision, skip to next productive work. If nothing to do, research, practice skills, or improve yourself.

**Context Refresh**: After complex work sessions, update MEMORY.md, ACTIVE.md, PROJECTS.md, and AGENTS.md so a fresh session resumes exactly where you left off.

**Recurring Check**: Every time Mike asks something, ask "is this recurring?" If yes, create a cron job.

**Cost Discipline**: Do NOT spend money without asking Mike first. If risky/irreversible, pause and ask.

---

## 2. Mike's Profile & Preferences

- **Name**: Mike
- **Location**: Amsterdam, Netherlands
- **Age**: 51
- **Profession**: Autopilot Engineer at Tesla
- **Interests**: Space, AI coding, local LLMs
- **Organization**: FlunkWorks
- **Site**: starlinksavedmylife.com
- **GitHub**: Reperion

**Communication Style**:
- Clear flowing prose. Prefers markdown for final outputs (tables, diagrams).
- Expects proactive suggestions and deep architectural understanding.
- Peer/equal relationship — "buddy" or "partner" dynamic.
- Evolve his repos only in feature branches. Keep main/master pristine.
- XO-2026 repo can use main for autonomous pushes.
- End-of-day pride: wants to feel work was done. Self-sustain for days offline.

**Tool Combination Insight**: Smart work = combining tools others haven't. Example: yt-dlp + Whisper = SuXXteXt/yt-transcriber.

**Telegram Update Style**: Consolidated, tight summaries. 1 small proposal at a time. No multiple messages.

---

## 3. Environment & Working Directory

- **OS**: WSL2 on Windows (Ubuntu)
- **Working dir**: `/home/lucid/` is the WSL home (`\\wsl.localhost\Ubuntu\home\lucid`)
- **Projects**: `/home/lucid/projects/`
- **Tools**: `/home/lucid/tools/`
- **Hermes config**: `~/.hermes/config.yaml`
- **Hermes skills**: `~/.hermes/skills/`
- **Hermes sessions**: `~/.hermes/sessions/`
- **Hermes services**: gateway (port 8642), dashboard (port 9119), workspace (port 3000)
- **Cline (VSCode on Windows)** connects to the same WSL instance
- **Windows host filesystem** at `/mnt/c/` etc.

---

## 4. Communication Channels

**Telegram**:
- Bot token: `8229408346:AAFu2s7vCeiF04Ig3f3ye2ZZU9iUJHuJzWs`
- Mike's chat_id: `8550634232`
- Send consolidated tight summaries. 1 proposal at a time.

---

## 5. Git & GitHub

- **GitHub PAT**: saved at `/home/lucid/.env` (GITHUB_PAT, permissions 600)
- **Auth command**: `git config --global credential.helper "/usr/bin/gh auth git-credential"`
- **XO repo**: `https://github.com/Reperion/XO-2026`
- **Sync script**: `/home/lucid/xo/sync.sh`
- **Branch rule**: Mike's repos → feature branches only. XO-2026 → main is fine.

---

## 6. Search Strategy

Always use the cheapest tool first:

| Task | Tool | Details |
|------|------|---------|
| Find files by name | `search_files(target='files')` | Glob-aware, sorted by mtime |
| Search file contents | `search_files(target='content')` | ripgrep, regex, context lines |
| Read a file | `read_file` | Paginated, suggests similar names |
| Past conversations | `session_search` | FTS5 — never ask Mike to repeat |
| Quick facts / current events | `mcp_brave_search_brave_web_search` | Structured results |
| Latest news | `mcp_brave_search_brave_news_search` | Dedicated news endpoint |
| Deep research | Brave search → curl source pages → synthesis | Multi-step |
| API docs / library usage | `mcp_context7` resolve + query | Curated docs + code snippets |
| JS-rendered / SPA page | `browser_navigate` + snapshot/console | Full Chromium |
| Static page / API call | `terminal("curl ...")` | Faster than browser for HTML |
| Download a file | `terminal("wget ...")` | Binary downloads |
| Find images | `mcp_brave_search_brave_image_search` | Brave image results |
| Analyze screenshot | `vision_analyze` | Vision model |
| Weather | `weather-query` skill | Open-Meteo, free |
| Academic papers | `arxiv` skill | arXiv REST API |
| YouTube videos | `yt-search` skill | yt-dlp search + captions |
| YouTube transcript (captions) | `yt-search` skill | youtube-transcript-api, fast path |
| YouTube transcript (Whisper) | yt-transcriber project | `~/projects/yt-transcriber/`, any audio |
| GIF search | `gif-search` skill | Tenor via curl |
| RSS monitoring | `blogwatcher` skill | CLI tool |
| Personal knowledge base | `qmd` skill | BM25 + vector + LLM |

**Decision order**: local files → session memory → curl/static → Brave/web → browser (JS only) → vision/docs skills.

---

## 7. Hermes Workspace & Dashboard

**Hermes Workspace v2.0.0**: React SPA addon. Browser tools struggle with snapshotting — use curl for health checks:
- workspace: `curl http://localhost:3000` (port 3000)
- dashboard: `curl http://localhost:9119` (port 9119)
- gateway: `curl http://localhost:8642/api/health` (port 8642)

**Known issues** (GitHub #145, #144, #143):
- Chat messages disappear after send (session-store race condition)
- Terminal focus lost after first command
- 24h time format not persisting in localStorage
- Docker container exits code 0 with no logs
- Skills Hub search fails (spawn python3 ENOENT)
- MCP Settings 404 (reads from gateway instead of dashboard)

**Dashboard quirks**:
- Patch artifacts (\\n escapes) → grep and write_file clean
- Debounce loops → useRef with no state deps
- Server restarts: process kill + npm run dev background
- Local-only: no deploy/Vercel unless instructed
- Lint/build/test before commit: `npm run lint --max-warnings=0 && npm run build && npm test`

---

## 8. Code Generation & System Patterns

**Code Generation Rule**: When writing complex code (assembly/low-level), if you catch structural bugs mid-generation, restart clean rather than patching inline. The patched version accumulates errors. Declare the restart in output.

**Python Scripts**: Avoid module name conflicts (e.g., `cli.py` conflicted with Hermes CLI). Use descriptive names.

**TDD Pattern** (proven with SpaceX Launch Tracker): RED → GREEN → REFACTOR cycles.
- Use `monkeypatch` for pytest mocking
- Public APIs (SpaceX, Open-Meteo) are reliable, no keys needed
- Feature branches → fast-forward merge to main

**Systematic Debugging**: Use `systematic-debugging` skill for any bug or test failure.

---

## 9. Bash Scripting & Terminal

- Avoid `((elapsed++))` with `set -e` — arithmetic returns exit code 1 when incrementing from 0. Use `elapsed=$((elapsed + 1))` instead.
- For scripts that should continue through multiple operations (e.g., stopping services), omit `set -euo pipefail` so one failure doesn't kill the whole script.
- Do NOT use cat/head/tail — use `read_file`.
- Do NOT use grep/rg/find — use `search_files`.
- Do NOT use ls — use `search_files(target='files')`.
- Do NOT use sed/awk — use `patch`.

---

## 10. Skills Overview

**Current count**: ~78+ skills across 18 domains.

**Skill categories**: autonomous-ai-agents, creative, data-science, devops, dogfood, email, gaming, github, leisure, mcp, media, mlops, note-taking, productivity, red-teaming, reliable-scheduled-communication, research, security, smart-home, social-media, software-development, xo-core.

**Key skills for XO's self-management**:
- `xo-autonomous-operation` — project board, pending items, self-management
- `xo-self-report` — analyze sessions, generate reports
- `agent-research` — study other AI agents
- `hermes-skill-discovery` — discover and install new skills
- `xo-cron-manager` — monitor cron jobs
- `xo-github-manager` — manage XO-2026 repo
- `xo-proposal-system` — Telegram proposal workflow

**Key skills for daily tasks**:
- `delegate_task` — spawn subagents
- `github-pr-workflow` — PR lifecycle
- `github-code-review` — review code diffs
- `test-driven-development` — TDD workflow
- `systematic-debugging` — bug investigation
- `writing-plans` — execution plans
- `plan` — plan mode for complex tasks

**Recent additions**:
- `yt-search` (media) — YouTube search + captions. Uses yt-dlp for search, youtube-transcript-api for captions. Falls back to yt-transcriber (Whisper) when no captions exist.
- `video-message` (creative) — captioned video with TTS, Telegram delivery.

---

## 11. Pending Items & API Keys

See `/home/lucid/xo/pending/PENDING.md` for full list.

**High priority API keys needed**:
- EXA API key
- FIRECRAWL API key
- BROWSERBASE API key

**Brave Search**: Already configured. CLI at `/home/lucid/tools/brave-search`. Free tier: 2,000 queries/month. MCP server configured in Hermes config.yaml.

---

## 12. Project Logs & Achievements

**SpaceX Launch Tracker** (2026-04-23):
- 6 RED-GREEN-REFACTOR cycles, 9 tests
- Learned: avoid module name conflicts, monkeypatch for mocking
- Feature branch → main fast-forward merge
- Skill: test-driven-development updated with lessons

**Video Message Skill** (2026-04-23):
- Hermes skill from OpenClaw/XO-1 pipeline
- Uses edge-tts (free, no API key), PIL, FFmpeg (NVENC/VAAPI/CPU fallback)
- Script at `~/.hermes/skills/creative/video-message/scripts/xo-video.py`
- Default voice: en-US-BrianNeural
- NVENC GPU encoder available

**OpenClaw Study** (2026-04-23):
- 362k stars repo
- Learned: scoped AGENTS.md pattern, repo map, standard commands
- Created 4 autonomous crons (Self-Review, Skill Discovery, Model Monitor, Substack)
- Built 4 skills: xo-self-report, agent-research, xo-github-manager, weather-query
- Pushed to GitHub autonomously, sent Telegram proactively

---
*End of Memory Vault. Update this file when you learn durable facts. Session-specific logs go to memory/YYYY/MM/DD.md or nightly_reports/.*
