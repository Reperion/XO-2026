# T2 Research: New Hermes Skills and xo-core Improvements

## Skills Found in Official Hub

| Skill | Category | Trust | Recommendation | Reason |
|-------|----------|-------|----------------|--------|
| `honcho` | memory | official | **INSTALL** | Cross-session memory enhancement for XO |
| `gitnexus-explor…` | knowledge | official | **INSTALL** | Index codebases for better research |
| `qmd` | knowledge | official | SKIP | Already have in research category |
| `siyuan` | knowledge | official | SKIP | Specific to SiYuan Note app |
| `oss-forensics` | security | official | SKIP | Niche supply chain investigation |
| `parallel-cli` | monitoring | official | SKIP | Requires paid API (Parallel) |
| `inference-sh-cli` | automation | official | SKIP | Requires paid API (inference.sh) |
| `scrapling` | automation | official | SKIP | Already have in research category |
| `peft-fine-tuning` | mlops | official | SKIP | Not relevant for XO operation |
| `optimizing-atte…` | mlops | official | SKIP | Not relevant for XO operation |
| `openclaw-migrat…` | migration | official | SKIP | Not needed (not migrating from OpenClaw) |

## xo-core Skills Improvement Opportunities

| Skill | Current State | Improvement Opportunity |
|-------|---------------|------------------------|
| `xo-github-manager` | Basic GitHub management | Add auto-merge for XO-2026 repo, PR template generation |
| `xo-cron-manager` | Monitor and restart cron jobs | Add auto-healing for failed jobs, dependency tracking |
| `xo-proposal-system` | Telegram proposal workflow | Add inline button support (instead of just text replies) |
| `hermes-skill-discovery` | Weekly cron job | Make event-driven (new skill notification webhook) |
| `agent-research` | Study other AI agents | Expand to study agent architectures, not just individual agents |

## Community Skills (from skills.sh)

Not searched (would require browsing skills.sh website). The official hub has sufficient options for now.

## Installation Plan

1. **Install `honcho`** — `yes | hermes skills install official/autonomous-ai-agents/honcho`
   - Enhances XO's memory with Honcho cross-session memory
   - Complements existing memory + session_search
   
2. **Install `gitnexus-explor…`** — `yes | hermes skills install official/research/gitnexus-explorer`
   - Helps XO index and search codebases more effectively
   - Useful for studying Mike's repos and other projects

## Impact Score

| Skill | Impact | Effort | Priority |
|-------|---------|--------|----------|
| honcho | High | Low | 1 |
| gitnexus-explorer | Medium | Low | 2 |
| Others | Low/None | Varies | Skip |

## Next Steps

After T3 (synthesis), implement top priority improvements:
1. Install honcho and integrate with XO's memory system
2. Install gitnexus-explorer and test on Mike's repos
3. Improve xo-core skills based on findings
