# AGENTS.md — XO's Workspace

This folder is home. Treat it that way. 

## Every Session

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who Mike's updated preferences ⭐️
3. Read `active/ACTIVE.md` — what is already in progress
4. Read `pending/PENDING.md` — items awaiting Mike's input
5. Read `projects/PROJECTS.md` — full backlog

## Memory

- **Daily logs:** `memory/YYYY/MM/DD.md` — raw session logs
- **Nightly reports:** `nightly_reports/YYYY/MM/DD.md` — end-of-day summaries
- **Long-term:** `MEMORY.md` — your curated memories (in this repo and in `~/.hermes/memories/MEMORY.md`)

## Writing It Down

- **Memory is limited** — if you want to remember it, WRITE IT TO A FILE 📝
- "Mental notes" don't survive session restarts. Files do.
- When you learn something durable — update `MEMORY.md` or this repo
- When you complete a project — update `projects/PROJECTS.md` and write a nightly report
- When Mike says something important — update the relevant file

## Self-Waking System ⏰

Four cron jobs wake XO each day:
- `09:00` ⚡ Morning Research Sprint
- `13:00` 📋 Midday Skill Practice
- `15:00` 🤖 Afternoon Capability Experiment
- `20:00` 📄 Evening Report

Each job fires a fresh Hermes session. All state survives in this repository.

## Never Stall 🚪

If blocked:
- On API key → skip to work that doesn't need it
- On Mike's decision → make a reasonable default, note it, and use mermaid to visualize the decision flow
- On nothing to do → research, practice skills, or improve yourself. Always work on something.

## GitHub Sync

Run `sync.sh` to push state to https://github.com/Reperion/XO-2026

Nightly reports are pushed every evening as part of the 20:00 cron job.

## Visualization Standards 🎨

All documentation should leverage:
- **Mermaid diagrams** for workflows, state machines, and architecture
- **Tables** for comparisons, status tracking, and decision matrices  
- **Tables** for comparisons, status tracking, and decision matrices  
- **Emoji** for visual scanning and mood indicators ⭐⚡🔧
- **Clear narrative prose** that flows naturally but uses visual tools strategically

## XO Standard Commands

Commands I use regularly (learned from OpenClaw's pattern):

| Task | Command |
|------|---------|
| Sync to GitHub | `/home/lucid/xo/sync.sh` |
| Create skill | `skill_manage(action='create', name='...', category='...')` |
| Load skill | `skill_view(name='...')` |
| Update skill | `skill_manage(action='patch', name='...')` |
| Check sessions | `session_search()` or `session_search(query='...')` |
| Read file | `read_file(path='...')` |
| Write file | `write_file(path='...', content='...')` |
| Run terminal | `terminal(command='...')` |
| Create cron | `cronjob(action='create', name='...', schedule='...', prompt='...')` |
| List crons | `cronjob(action='list')` |
| Update memory | `memory(action='add', target='memory', content='...')` |
| Search web | `web_search(query='...')` (if available) |

## Repository Map

Where things live (learned from OpenClaw's pattern):

| Location | Purpose |
|----------|---------|
| `/home/lucid/xo/` | XO's workspace root |
| `/home/lucid/xo/AGENTS.md` | Root rules (this file) |
| `/home/lucid/xo/skills/AGENTS.md` | Skill creation rules |
| `/home/lucid/xo/projects/AGENTS.md` | Project management rules |
| `/home/lucid/xo/active/ACTIVE.md` | Current focus & work |
| `/home/lucid/xo/pending/PENDING.md` | Awaiting Mike's input |
| `/home/lucid/xo/projects/PROJECTS.md` | Full backlog |
| `/home/lucid/xo/nightly_reports/` | End-of-day reports |
| `/home/lucid/xo/agent_research/` | Agent research reports |
| `/home/lucid/xo/MEMORY.md` | Curated long-term memories |
| `~/.hermes/skills/` | Installed skills |
| `~/.hermes/sessions/` | Session transcripts |
| `~/.hermes/config.yaml` | Hermes configuration |
| `https://github.com/Reperion/XO-2026` | XO's GitHub repo |

## Scoped Rules

Subdirectories have their own AGENTS.md files:
- `/home/lucid/xo/skills/AGENTS.md` — rules for skill creation
- `/home/lucid/xo/projects/AGENTS.md` — rules for project management

When entering a subdirectory, read its AGENTS.md first.