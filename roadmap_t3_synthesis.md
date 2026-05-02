# T3 Synthesis: XO Evolution Roadmap

## Executive Summary

Based on T1 (capabilities audit) and T2 (new skills research), XO's #1 weakness is **self-improvement** (reactive, not proactive). The roadmap below prioritizes high-impact, low-effort improvements that make XO more autonomous and capable.

## Top 5 XO Evolution Improvements

| Priority | Improvement | Impact | Effort | Source |
|----------|--------------|---------|--------|--------|
| 1 | **Install honcho for enhanced memory** | High | Low | T2 research |
| 2 | **Improve xo-proposal-system with inline buttons** | High | Medium | T1 audit (gap) |
| 3 | **Install gitnexus-explorer for code research** | Medium | Low | T2 research |
| 4 | **Add auto-healing to xo-cron-manager** | Medium | Medium | T1 audit (gap) |
| 5 | **Create XO self-evolution tracking system** | Medium | Low | T1 audit (gap) |

## Detailed Specifications

### Priority #1: Install honcho for Enhanced Memory

**What:** Install `honcho` skill from official hub to add cross-session memory capabilities.

**Why:** T1 audit identified XO's self-improvement as "reactive, not proactive." Honcho provides persistent memory across sessions that complements existing memory + session_search.

**Implementation:**
```bash
yes | hermes skills install official/autonomous-ai-agents/honcho
```

**Success Criteria:**
- honcho skill appears in `hermes skills list --source hub`
- XO can store/retrieve cross-session memory
- No conflicts with existing memory system

---

### Priority #2: Improve xo-proposal-system with Inline Buttons

**What:** Upgrade the Telegram proposal system to use inline keyboard buttons (Approve/Reject) instead of text replies.

**Why:** T1 audit found proposal system uses text replies ("approve"/"reject"). Inline buttons are more user-friendly and reliable.

**Implementation:**
1. Modify `/home/lucid/.hermes/skills/xo-core/xo-proposal-system/SKILL.md`
2. Update proposal sending code to use `reply_markup` with InlineKeyboard
3. Add callback query handler for button presses
4. Test with Telegram

**Success Criteria:**
- Proposals sent with Approve/Reject buttons
- Mike can click button instead of typing reply
- Callback query properly detected and processed

---

### Priority #3: Install gitnexus-explorer for Code Research

**What:** Install `gitnexus-explorer` skill to index and search codebases.

**Why:** Helps XO research Mike's repos (Reperion/XO-2026) and other projects more effectively.

**Implementation:**
```bash
yes | hermes skills install official/research/gitnexus-explorer
```

**Success Criteria:**
- gitnexus-explorer skill installed
- Can index a test repo (e.g., XO-2026)
- Can search indexed codebase

---

### Priority #4: Add Auto-Healing to xo-cron-manager

**What:** Enhance `xo-cron-manager` to detect failed cron jobs and auto-restart or notify.

**Why:** T1 audit found "some workers crash (pid issues)." Auto-healing would make XO more robust.

**Implementation:**
1. Load `xo-cron-manager` skill
2. Add failed job detection (check `hermes cron list` for stale jobs)
3. Add auto-restart logic (recreate job if failed)
4. Notify via Telegram on unrecoverable failures

**Success Criteria:**
- Failed cron jobs detected within 1 hour
- Auto-restart works for restartable jobs
- Telegram notification sent for unrecoverable failures

---

### Priority #5: Create XO Self-Evolution Tracking System

**What:** Set up a proper tracking system (kanban board or markdown) for XO's own evolution tasks.

**Why:** T1 audit found "No self-evolution tracking." XO should track its own improvements like any other project.

**Implementation:**
1. Create `/home/lucid/xo/evolution/` directory
2. Create `ROADMAP.md` (tracks improvements, status, priorities)
3. Create `CHANGELOG.md` (logs completed improvements)
4. Integrate with kanban (use existing T1-T6 tasks as seed)

**Success Criteria:**
- `evolution/ROADMAP.md` exists with tracked improvements
- `evolution/CHANGELOG.md` exists with completed items
- New evolution tasks automatically added to roadmap

---

## Effort vs. Impact Matrix

```
High Impact │   #2 (buttons)    │   #1 (honcho)    │
            │   Medium Effort   │   Low Effort      │
────────────┼───────────────────┼───────────────────┤
            │   #4 (auto-heal)  │   #3 (gitnexus)  │
Low Impact  │   Medium Effort   │   Low Effort      │
            │   #5 (tracking)   │                   │
            └───────────────────┴───────────────────┘
                Low Effort        High Effort
```

## Next Steps

1. T4 (writer) drafts detailed specs for #1 and #2 (top priorities)
2. T5 (xo) implements #1 (honcho installation)
3. T6 (xo) implements #2 (proposal system buttons)
4. Future kanban tasks for #3, #4, #5

---

*Synthesized from T1 (audit) and T2 (research) findings.*
