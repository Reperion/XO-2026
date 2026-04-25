# XO Skill Discovery Report — 2026-04-25

## Summary
Ran Hermes Skills Hub discovery scan across all sources (official, skills-sh, github, lobehub, clawhub).
Searched queries: `automation`, `self-improvement`, `research`, `monitoring`, `github`, `cron`.

## Skills Hub Overview
- **59 official optional skills** from Nous Research
- Multiple community sources (skills.sh, lobehub, clawhub, github)
- **6 new skills installed** this session

## Newly Installed Skills

### 1. `agentmail` (official/email/agentmail)
- **Category:** Email
- **Use:** Give XO its own dedicated email inbox via AgentMail. Send, receive, and manage email autonomously using agent-owned email addresses.
- **Why for XO:** Enables autonomous email communication — sign up for services, receive notifications, communicate with external agents/humans. Critical capability expansion for autonomous operation.
- **Setup required:** AgentMail API key + MCP server config in `~/.hermes/config.yaml`

### 2. `scrapling` (official/research/scrapling)
- **Category:** Research / Web Scraping
- **Use:** Web scraping with stealth browser automation, Cloudflare bypass, and spider crawling via CLI and Python.
- **Why for XO:** When `web_extract` isn't enough. Enables scraping JS-rendered pages and bypassing bot protection for research tasks.
- **Setup required:** `pip install scrapling` (and optionally `scrapling install` for browser automation)

### 3. `qmd` (official/research/qmd)
- **Category:** Research / Knowledge Base
- **Use:** Search personal knowledge bases, notes, docs, and meeting transcripts locally. Hybrid retrieval engine with BM25, vector search, and LLM reranking.
- **Why for XO:** Enables local semantic search over XO's own knowledge base and notes. Complements session_search with more powerful retrieval.
- **Setup required:** Node.js, `npm install -g @tobilu/qmd`, plus daemon setup

### 4. `docker-management` (official/devops/docker-management)
- **Category:** Devops
- **Use:** Manage Docker containers, images, volumes, networks, and Compose stacks — lifecycle ops, debugging, cleanup, and Dockerfile optimization.
- **Why for XO:** If XO deploys services or runs infrastructure, Docker management is essential for autonomous ops.
- **Setup required:** Docker Engine installed and running

### 5. `sherlock` (official/security/sherlock)
- **Category:** Security / OSINT
- **Use:** OSINT username search across 400+ social networks. Hunt down social media accounts by username.
- **Why for XO:** Useful for research and reconnaissance tasks XO might need to perform autonomously.
- **Setup required:** `pip install sherlock-project` or Docker

### 6. `fastmcp` (official/mcp/fastmcp)
- **Category:** MCP
- **Use:** Build, test, inspect, install, and deploy MCP servers. Includes scaffolding scripts and templates.
- **Why for XO:** Enables XO to create custom MCP servers to extend its capabilities. Most impactful for building new integrations.
- **Includes:** templates (file_processor.py, api_wrapper.py, database_server.py), scaffolding script, CLI reference

## Skills Considered But Not Installed

| Skill | Reason |
|-------|--------|
| `honcho` (cross-session memory) | XO already has `memory` tool and `session_search` — Honcho would be redundant for current setup |
| `parallel-cli` (agent-native web search) | Paid service, requires API key; overlaps with built-in `web_search`/`web_extract` |
| `inference-sh-cli` (150+ AI apps) | Useful but not core to XO's autonomy mission — can install on demand |
| `blackbox` (delegate coding) | XO already has claude-code, codex, opencode delegation skills |
| `openclaw-migration` | For migrating from OpenClaw, not relevant to XO |
| `1password` | Not relevant for a headless agent |
| `blender-mcp`, `touchdesigner-mcp`, `meme-generation` | Creative skills, not autonomy-relevant |
| `canvas` (LMS integration) | Not relevant for XO's use case |
| Community skills (skills.sh, lobehub) | Lower trust, mostly generic, not specifically autonomy-enhancing |

## Skills Update Check
No hub-installed skills to update (first installation cycle).

## Recommendations
1. **agentmail setup** — If XO needs autonomous email, configure the AgentMail MCP server in `~/.hermes/config.yaml` with an API key from https://console.agentmail.to
2. **fastmcp usage** — Use the scaffolding script (`scripts/scaffold_fastmcp.py`) to create custom MCP servers for XO's unique needs
3. **qmd setup** — If XO's knowledge base is markdown-based, set up qmd for semantic search over notes
4. **Re-run discovery weekly** — Keep the cron job active to catch new skills as they're published
