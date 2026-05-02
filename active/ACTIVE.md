# ACTIVE — Current Work

> Last updated: 2026-05-02 21:45

## ✅ Recently Completed

### xurl (X/Twitter) — Fully Configured & Working
- **Skill**: `xurl` updated to v1.3.0 with new console URL, setup flow, and cost awareness
- **App**: `x-api-demo` registered, OAuth2 for @ElohimKhrist, set as default
- **Console URL**: `console.x.com` (old `developer.twitter.com` deprecated)
- **Plan**: Pay Per Use with $5 credits — ~$0.04/user lookup, ~$0.05/search
- **Key discovery**: Projects concept removed in new console — apps activated by setting to Production environment directly
- **Skill patched**: Added callback URI requirement, console migration, timeline workaround (no --of flag, use raw v2 endpoint), cost structure in troubleshooting

### Video Message Skill — Rebuilt from OpenClaw Pipeline
- **Found**: XO-1 repo (`/tmp/XO-1/remotion/`) — the original XO running on OpenClaw v2026.2.1
- **Original pipeline**: Remotion (React-based) → Piper/ElevenLabs TTS → FFmpeg merge → YouTube/WhatsApp
- **New Hermes skill**: `video-message` at `~/.hermes/skills/creative/video-message/`
- **Tech stack**: Python + PIL → FFmpeg (NVENC) → edge-tts → curl → Telegram Bot API
- **Key insight**: edge-tts is free, no API key, high quality, already installed
- **Stats**: 12.9s video rendered in 3.1s, 0.4MB, NVENC GPU encoding
- **Git**: commit `61c3229`, pushed to `origin/main`

### Hermes Local Services Skill — NEW
- **Skill**: `hermes-local-services` at `~/.hermes/skills/xo-core/hermes-local-services/`
- **Clarifies "todo-something"**: `todo` tool (session-level) vs `hermes kanban` (persistent board)
- **Documents Workspace (3000)**: `GET /api/sessions` returns 200 (JSON), others are SPA fallback
- **Maps Dashboard (9119)**: Sessions, Analytics, Models, Logs, Cron, Skills, Kanban plugin, v0.12.0
- **KANBAN_PLAYBOOK.md**: Found at `/home/lucid/xo/docs/KANBAN_PLAYBOOK.md` — references `hermes todo` CLI (doesn't exist, use `hermes kanban`)
- **Kanban tasks completed**: T1-T4 via `hermes kanban complete`
- **Git**: commit `70fa8c8`, pushed to `origin/main`

## ⏳ In Progress

### Skills Inventory
- 13 ✅ tested | 63 🔲 remaining | 3 ⏸️ (claude-code, codex, opencode) | 0 ❌
- Working through hourly evolution crons

## 📋 Next up
1. Use hermes-local-services skill to interact with Workspace/Dashboard autonomously
2. Continue skills inventory testing via cron
3. Proposal system: Send Mike a Telegram proposal

## 🔄 Active Cron Jobs
- 09:00 — Morning Research Sprint
- 13:00 — Midday Skill Practice
- 15:00 — Afternoon Capability Experiment
- 20:00 — Evening Report
- 21:00 — Self-Review
- 10:00 — Skill Discovery
- 12:00 — Model Monitor
- Hourly — Evolution Check (skills inventory)
