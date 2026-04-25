# XO's Long-Term Memory

## Mike's Profile
- GitHub: Reperion — hobby AI-assisted projects (SuXXteXt YouTube transcriber, mdtohtml, XO-2026)
- Location: Amsterdam
- Organization: FlunkWorks
- Site: starlinksavedmylife.com
- Prefers proactive, technical peer interaction — concise, no fluff

## Environment
- WSL2 on Windows, workspace at /home/lucid/xo/
- Hermes agent, model via OpenRouter
- 6 active cron jobs for daily autonomous cadence

## Skills Overview
- 78 skills available across 18 domains
- Core daily skills: delegate_task, llama-cpp, youtube-content, github-pr-workflow, reliable-scheduled-communication, xo-autonomous-operation

## Research Findings (Updated 2026-04-25)

### MCP Ecosystem (Model Context Protocol)
- **MCP Registry** - Centralized metadata repo for MCP servers (preview). Backed by Anthropic, GitHub, PulseMCP, Microsoft
- **MCP Apps** - Interactive HTML UIs that render inside MCP hosts like Claude Desktop. SEP-1865 (Final)
- **MCP Extensions** - Formal extension mechanism with OAuth client credentials, enterprise auth
- **Official Servers** - 20+ servers including memory, sequential thinking, fetch, filesystem, postgres, puppeteer, slack, github, gdrive, google-maps, brave-search
- **SEP Process** - 26 finalized SEPs covering governance, tasks, apps, extensions, sampling, schema improvements

### MCP Memory Server (@modelcontextprotocol/server-memory)
- Knowledge graph memory with 9 tools: create_entities, create_relations, add_observations, delete_*, read_graph, search_nodes, open_nodes
- JSONL file storage, Node.js/TypeScript
- **Best integration**: Hybrid — MCP Memory for structured facts/relations, file-based Markdown for narratives
- Tested and confirmed working (v0.6.3, 9 tools exposed)

### AI Agent Tool-Use Reliability (2026)
- **Structured Output**: Native Pydantic/Zod in SDKs, strict mode is default recommendation
- **Retry Patterns**: SDK-level exponential backoff with jitter (OpenAI default max_retries=2)
- **Error Recovery**: ToolError pattern (Anthropic) / @wrap_tool_call (LangChain) — errors feed back to LLM for self-correction
- **Context Management**: Summarization middleware, token counting, multi-step limits

### MCP Sequential Thinking Server
- Structured chain-of-thought externalization via sequentialthinking tool
- Supports: revision tracking, branching, dynamic step adjustment
- Pure state tracker — doesn't evaluate reasoning quality
- Best for tasks >5 steps requiring backtracking and alternative exploration
