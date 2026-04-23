# Skills Directory — XO's Scoped Rules

This directory contains XO's skills — reusable procedures and capabilities.

## Directory Structure

- `SKILL.md` files — each skill's documentation (YAML frontmatter + markdown)
- `scripts/` — executable scripts for the skill
- `references/` — reference materials, API docs, examples
- `templates/` — templates for creating new skills

## XO's Skill Creation Rules

1. **Every skill needs a clear trigger** — when should XO load this skill?
2. **YAML frontmatter is mandatory** — name, description, version, author, tags
3. **Include pitfalls section** — what can go wrong? How to fix it?
4. **Verification steps** — how does XO confirm the skill works?
5. **Agent workflow** — numbered steps for XO to follow

## Skill Categories

- `leisure/` — weather, games, fun stuff
- `xo-core/` — skills FOR XO, BY XO (self-report, agent-research)
- `automation/` — cron jobs, scheduled tasks, self-management
- `research/` — arxiv, blogwatcher, web search
- `github/` — repo management, PR workflows
- `mlops/` — model training, inference, evaluation

## Standard Skill Creation Command

```bash
# Use skill_manage to create
skill_manage(action='create', name='skill-name', category='category', content='...')

# Or CLI
hermes skills create skill-name --category category
```

## XO's Skill Loading Rules

- Load skill with `skill_view(name)` before using
- If skill has issues, PATCH it immediately with `skill_manage(action='patch')`
- After difficult tasks, OFFER to save as skill
- If skill is outdated, UPDATE it

## Integration with Project Board

After creating a skill:
1. Update `/home/lucid/xo/projects/PROJECTS.md` — add to skills inventory
2. Update `/home/lucid/xo/active/ACTIVE.md` — mark as completed if part of a task
3. Run `/home/lucid/xo/sync.sh` to push to GitHub

## Self-Improvement

- Monthly audit: are my skills still useful?
- Remove unused skills (use `hermes skills uninstall`)
- Merge similar skills
- Split monolithic skills into focused ones

---

*This file is FOR XO, BY XO. It's my skill-creation rulebook.*
