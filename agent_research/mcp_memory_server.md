# MCP Memory Server — Research Report

**Date:** 2026-04-25  
**Source:** https://github.com/modelcontextprotocol/servers/tree/main/src/memory  
**Package:** `@modelcontextprotocol/server-memory` (v2026.1.26)  

---

## What It Is

The MCP Memory Server is an **official MCP server** from Anthropic's Model Context Protocol project that provides **persistent knowledge graph memory** for AI agents. It runs as a stdio-based MCP server exposing tools that let an LLM (like Claude or any MCP-compatible agent) read/write a structured knowledge graph to a JSONL file on disk.

## How It Works

### Architecture

```
┌─────────────┐     stdio/JSON-RPC     ┌──────────────────────┐
│  AI Agent   │ ◄────────────────────► │  MCP Memory Server   │
│  (Hermes,   │   9 tools exposed      │  (index.ts, Node.js) │
│   Claude)   │                        │                      │
└─────────────┘                        └──────────┬───────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────────┐
                                        │  memory.jsonl        │
                                        │  (JSONL file on disk)│
                                        └──────────────────────┘
```

- **Transport:** STDIO (JSON-RPC messages over stdin/stdout)
- **Server framework:** `@modelcontextprotocol/sdk` (v^1.26.0)
- **Storage:** JSONL file (`memory.jsonl` by default)
- **Language:** TypeScript (compiled to Node.js)

### Data Model: Knowledge Graph

The server stores data as a **directed graph** with three core primitives:

| Concept | Type | Description | Example |
|---------|------|-------------|---------|
| **Entity** | Node | A named thing with a type and observations | `{name: "Alice", entityType: "person", observations: ["speaks Spanish"]}` |
| **Relation** | Edge | A directed connection between two entities | `{from: "Alice", to: "Anthropic", relationType: "works_at"}` |
| **Observation** | Property | Atomic fact strings attached to entities | `"Prefers morning meetings"` |

### Storage Format (JSONL)

The graph is serialized as **JSONL** (one JSON object per line). Each line has a `type` field (`"entity"` or `"relation"`) for reconstruction:

```jsonl
{"type":"entity","name":"Alice","entityType":"person","observations":["speaks Spanish","works at Anthropic"]}
{"type":"relation","from":"Alice","to":"Anthropic","relationType":"works_at"}
{"type":"entity","name":"John_Smith","entityType":"person","observations":["Speaks fluent Spanish","Graduated in 2019"]}
```

The `type` field is stripped during `loadGraph()` so the in-memory objects are clean.

## Tools Exposed (9 total)

| Tool | Purpose | Key Inputs |
|------|---------|------------|
| `create_entities` | Create new nodes | `entities: [{name, entityType, observations}]` |
| `create_relations` | Create directed edges | `relations: [{from, to, relationType}]` |
| `add_observations` | Add facts to existing entities | `observations: [{entityName, contents}]` |
| `delete_entities` | Remove nodes + cascade relations | `entityNames: string[]` |
| `delete_observations` | Remove specific facts | `deletions: [{entityName, observations}]` |
| `delete_relations` | Remove specific edges | `relations: [{from, to, relationType}]` |
| `read_graph` | Dump entire graph | (none) |
| `search_nodes` | Search by name/type/observation | `query: string` |
| `open_nodes` | Retrieve specific nodes + their relations | `names: string[]` |

## Configuration

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `MEMORY_FILE_PATH` | Custom path for the JSONL file | `memory.jsonl` in server directory |

### Setup Methods

#### NPX (easiest)
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

#### Docker
```json
{
  "mcpServers": {
    "memory": {
      "command": "docker",
      "args": ["run", "-i", "-v", "claude-memory:/app/dist", "--rm", "mcp/memory"]
    }
  }
}
```

#### Custom file path
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/custom/memory.jsonl"
      }
    }
  }
}
```

## Internal Implementation Details

- **Backward compatibility:** Automatically migrates `memory.json` → `memory.jsonl` if the old file exists
- **Duplicate handling:** `createEntities` silently ignores entities with existing names; `addObservations` deduplicates
- **Cascade deletes:** Deleting an entity also removes all relations involving it
- **Search:** Simple case-insensitive substring match across entity names, types, and observations
- **Relations in queries:** `open_nodes` and `search_nodes` return relations where *either* endpoint is in the result set (not both), so you can discover connections to nodes outside the result set

## Comparison: MCP Memory Server vs. XO's Current File-Based Memory

### XO's Current System

| Aspect | Current XO System |
|--------|-------------------|
| **Format** | Markdown files (`MEMORY.md`, daily logs in `memory/YYYY/MM/DD.md`) |
| **Structure** | Free-form text with headings and sections |
| **Query** | Manual reading by agent (`read_file`, grep) |
| **Persistence** | Multiple files, Git-tracked, cron-pushed to GitHub |
| **Granularity** | Session-level logs + curated long-term memory |
| **Relation tracking** | Implicit (narrative text, bullet points) |
| **Agent access** | Direct file I/O via terminal tools |

### MCP Memory Server

| Aspect | MCP Memory Server |
|--------|-------------------|
| **Format** | JSONL (structured knowledge graph) |
| **Structure** | Entities ↔ Relations ↔ Observations |
| **Query** | MCP tools: `search_nodes`, `open_nodes`, `read_graph` |
| **Persistence** | Single JSONL file, no built-in Git integration |
| **Granularity** | Atomic observations per entity |
| **Relation tracking** | Explicit directed relations between entities |
| **Agent access** | MCP protocol tools (not direct file I/O) |

### Key Differences

1. **Structured vs. Unstructured:** MCP Memory uses a graph with typed nodes and edges; XO uses free-form Markdown
2. **Query mechanism:** MCP provides search/open/read tools; XO requires file reads and manual text parsing
3. **Atomicity:** MCP stores individual observations as strings; XO stores paragraphs/notes
4. **Relations:** MCP has explicit `{from → to, relationType}` edges; XO has none
5. **Integration:** MCP speaks STDIO MCP protocol; XO uses direct file system
6. **Version control:** XO memory is Git-tracked; MCP's JSONL file could be Git-tracked but isn't by default

## Integration Possibilities with XO

### Option A: Replace File-Based Memory

Add the MCP Memory Server as a configured MCP server in Hermes config. The agent would use `create_entities`/`add_observations` for writing and `search_nodes`/`open_nodes` for reading instead of file I/O.

**Pros:** Structured knowledge graph, explicit relations, MCP-native  
**Cons:** Loses Markdown readability, breaks existing workflows, single-file storage, no built-in Git sync  

### Option B: Augment (Hybrid)

Keep the existing file-based system for:
- Long-form logs and narratives (`memory/YYYY/MM/DD.md`)
- Curated memory (`MEMORY.md`)
- Project state (`ACTIVE.md`, `PROJECTS.md`)

Add MCP Memory Server for:
- Structured facts about Mike (preferences, identity, projects)
- Relationship tracking (which project relates to which skill)
- Quick lookups via search

### Option C: File-Based MCP Server

Instead of using the official MCP Memory Server, build a custom MCP server that wraps the existing file-based memory system, exposing the files as MCP resources/tools. This gives MCP compatibility without changing the storage format.

## Recommendation

**Option B (Hybrid)** is the most practical approach:

1. **Install** `@modelcontextprotocol/server-memory` via NPX
2. **Point** `MEMORY_FILE_PATH` to `/home/lucid/xo/memory/knowledge_graph.jsonl`
3. **Use** MCP tools for structured facts + relations (Mike's preferences, GitHub repos, project relationships)
4. **Keep** existing Markdown files for narrative logs, project boards, and curated long-term memory
5. **Create** a sync mechanism or dual-write for critical memories that should exist in both systems

## Files Analyzed

| File | URL |
|------|-----|
| README.md | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/README.md` |
| index.ts (487 lines) | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/index.ts` |
| package.json | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/package.json` |
| Dockerfile | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/Dockerfile` |
| knowledge-graph.test.ts | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/__tests__/knowledge-graph.test.ts` |
| file-path.test.ts | `https://github.com/modelcontextprotocol/servers/blob/main/src/memory/__tests__/file-path.test.ts` |
| Heremes config | `/home/lucid/.hermes/config.yaml` |
| XO memory system | `/home/lucid/xo/MEMORY.md`, `/home/lucid/xo/memory/` |

## Current State of Hermes Config

Hermes already has MCP server support configured:
- `context7` MCP server is configured with `@upstash/context7-mcp`
- Platform toolsets include `memory` (Hermes' own built-in memory toolset)
- The `mcp_servers` section exists but the memory server is NOT currently configured

Adding the MCP Memory Server would require adding it to the `mcp_servers` section of `/home/lucid/.hermes/config.yaml`.
