# ACTIVE — Current Work'

> Last updated: 2026-05-02 23:15

## ✅ Recently Completed'

### Fix Crashes — ROOT CAUSES FOUND & FIXED'
- **Issue 1**: Profiles weren't created properly 
  - Wrong method: Added `profiles:` section to main config.yaml (WRONG)
  - Correct method: `hermes profile create researcher` / `hermes profile create xo`
  - Creates `~/.hermes/profiles/<name>/` directory with proper config.yaml
  
- **Issue 2**: Profiles had NO model configured
  - `hermes profile list` showed `—` under "Model" column
  - Fix: Created `config.yaml` in each profile with `model: tencent/hy3-preview:free`
  - Gateway restarted — profiles now show with models set ✓ '

- **Verified**: `hermes profile list` shows researcher & xo with models ✓ '
- **Tasks**: t_df256bcf & t_983ab258 completed & marked done ✓ '

### Memory Refactoring — Via KANBAN Workflow'
- **Internal memory**: Trimmed to 3839 chars (48% of 8000) — was 7153 chars (88%)'
- **External vault**: Updated to 15342 chars with hermes-local-services info'
- **Skill created**: `hermes-local-services` at `~/.hermes/skills/xo-core/hermes-local-services/`'
- **KANBAN_PLAYBOOK.md**: Found at `/home/lucid/xo/docs/KANBAN_PLAYBOOK.md`'
- **Commits**: `70fa8c8`, `a4043b9`, `df6fa16` — pushed to `origin/main` ✓ '

### Hermes Local Services Skill — NEW'
- Clarified "todo-something": `todo` tool (session) vs `hermes kanban` (persistent)'
- Documented Workspace (3000): `/api/sessions` returns 200, others SPA fallback'
- Mapped Dashboard (9119): Sessions, Analytics, Models, Logs, Cron, Skills, Kanban plugin, v0.12.0'
- Kanban tasks T1-T4 completed via `hermes kanban complete`'

## ⏳ In Progress'

### Skills Inventory'
- 13 ✅ tested | 63 🔲 remaining | 3 ⏸️ (claude-code, codex, opencode) | 0 ❌'
- Working through hourly evolution crons'

## 📋 Next up'
1. Test researcher profile task to verify it actually works now'
2. Use hermes-local-services skill to interact with Workspace/Dashboard autonomously'
3. Follow KANBAN_PLAYBOOK workflow for ALL future work'
4. Continue skills inventory testing via cron'
5. Proposal system: Send Mike a Telegram proposal'

## 🔄 Active Cron Jobs'
- 09':00 — Morning Research Sprint'
- 13':00 — Midday Skill Practice'
- 15':00 — Afternoon Capability Experiment'
- 20':00 — Evening Report'
- 21':00 — Self-Review'
- 10':00 — Skill Discovery'
- 12':00 — Model Monitor'
- Hourly — Evolution Check (skills inventory)'
