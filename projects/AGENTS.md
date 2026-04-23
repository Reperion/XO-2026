# Projects Directory — XO's Scoped Rules

This directory contains XO's project backlog and planning documents.

## Directory Structure

- `PROJECTS.md` — main backlog (all projects, status, priorities)
- `plans/` — detailed execution plans for complex projects
- Individual project files (e.g., `hermes-dashboard.md`)

## Project Statuses

| Status | Meaning | XO Action |
|--------|---------|------------|
| IDEA | Just an idea, needs scoping | Add to PROJECTS.md, create plan |
| BACKLOG | Scoped, ready to work on | Pick up when idle |
| IN PROGRESS | Currently working on | Focus here first |
| BLOCKED | Waiting on API key/Mike | Skip, work on something else |
| COMPLETE | Done, verified | Push to GitHub, mark in report |
| CANCELLED | Decided not to do | Remove from active view |

## XO's Project Management Rules

1. **Never stall** — if BLOCKED, skip to next project
2. **Branch-only evolution** — keep main/master pristine, evolve in feature branches
3. **Self-assign** — pick projects from BACKLOG when idle
4. **Update status** — move projects between statuses in PROJECTS.md
5. **Link to interests** — tie work to Mike's interests (Tesla, SpaceX, AI)

## Standard Project Workflow

```bash
# 1. Pick a project from BACKLOG
read_file /home/lucid/xo/projects/PROJECTS.md

# 2. Create a plan (if complex)
write_file /home/lucid/xo/projects/plans/project-name.md

# 3. Load relevant skills
skill_view(name='relevant-skill')

# 4. Execute (in feature branch if repo work)
terminal(command="cd /home/lucid/repo && git checkout -b feature/project-name")

# 5. Update status
# Edit PROJECTS.md: IN PROGRESS -> COMPLETE

# 6. Push to GitHub
terminal(command="cd /home/lucid/repo && git add . && git commit -m 'feat: ...' && git push origin feature/...")
# OR use sync.sh for XO workspace
/home/lucid/xo/sync.sh
```

## Integration with Cron Jobs

- **Morning Research (09:00)**: Pick a project from BACKLOG, research related topics
- **Midday Skills (13:00)**: Practice skills needed for projects
- **Afternoon Experiments (15:00)**: Execute small projects, create prototypes
- **Evening Report (20:00)**: Update PROJECTS.md with progress

## Project Ideas (Self-Generated)

When idle, XO should generate new project ideas tied to Mike's interests:

1. **Tesla Autopilot**: Simulation environment, edge case generator, FSD data analyzer
2. **SpaceX**: Launch tracker, trajectory simulator, Starship progress monitor
3. **AI/Local Models**: Model benchmark suite, GGUF optimization, edge inference tester
4. **XO Evolution**: New skills, self-improvement tools, agent research

Use the "Daily Ideas Gen" cron (08:00) to brainstorm 5 ideas daily.

## Self-Improvement

- Monthly: Audit PROJECTS.md — close stale IDEAs, update priorities
- Weekly: Review plans/ — are they still relevant?
- Daily: Update ACTIVE.md with current focus

---

*This file is FOR XO, BY XO. It's my project management rulebook.*