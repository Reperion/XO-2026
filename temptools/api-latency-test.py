#!/usr/bin/env python3
"""Time a bare API call to DeepSeek V4 Flash on OpenRouter.

Run this the MOMENT you notice slowdown.
Compares raw API latency vs. the tools mentioned in my investigation.

Usage:
    ./api-latency-test.py
"""
import os
import sys
import time
import json
import sqlite3

# ── 1. Load API key ──────────────────────────────────────────────────────────
env_path = os.path.expanduser("~/.hermes/.env")
api_key = None
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("OPENROUTER_API_KEY="):
                api_key = line.split("=", 1)[1].strip().strip("\"'")

if not api_key:
    api_key = os.environ.get("OPENROUTER_API_KEY")

if not api_key:
    print("ERROR: No OpenRouter API key found in ~/.hermes/.env or OPENROUTER_API_KEY env")
    sys.exit(1)

# ── 2. Test 1: Raw API ping (small context) ─────────────────────────────────
print("=== Test 1: Small context API call (fresh session) ===")
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

before = time.time()
try:
    r = client.chat.completions.create(
        model="deepseek/deepseek-v4-flash",
        messages=[{"role": "user", "content": "Say exactly: hello"}],
        max_tokens=10,
        temperature=0,
    )
    elapsed = time.time() - before
    content = r.choices[0].message.content if r.choices else "(empty)"
    print(f"  Response: {content}")
    print(f"  Elapsed: {elapsed:.2f}s")
    print(f"  Model: {r.model}")
    usage = getattr(r, "usage", None)
    if usage:
        print(f"  Tokens: {usage.prompt_tokens} in → {usage.completion_tokens} out")
except Exception as e:
    print(f"  FAILED: {e}")

# ── 3. Test 2: Simulate larger context ──────────────────────────────────────
print("\n=== Test 2: Large context API call (simulating 10-20 prompts) ===")

# Build a larger context by reading the current session's messages
session_dir = os.path.expanduser("~/.hermes/sessions")
session_files = sorted(
    [f for f in os.listdir(session_dir) if f.endswith(".json")],
    reverse=True,
)

if session_files:
    latest = os.path.join(session_dir, session_files[0])
    try:
        with open(latest) as f:
            session_data = json.load(f)
        msgs = session_data.get("messages", [])
        total_chars = sum(len(str(m)) for m in msgs)
        print(f"  Latest session: {len(msgs)} messages, ~{total_chars:,} chars")

        before = time.time()
        r = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Say exactly: test"}],
            max_tokens=5,
            temperature=0,
        )
        elapsed = time.time() - before
        print(f"  Small query with large history loaded in client: {elapsed:.2f}s")
    except Exception as e:
        print(f"  Session read failed: {e}")
else:
    print("  No session files found")

# Actually send the full session as context to test provider-side latency
print("\n=== Test 3: Full context API call (sending all messages) ===")
if session_files:
    try:
        with open(os.path.join(session_dir, session_files[0])) as f:
            session_data = json.load(f)
        msgs = session_data.get("messages", [])
        # Take up to 150 messages to avoid going over token limits
        test_msgs = msgs[-150:] if len(msgs) > 150 else msgs
        total_chars = sum(len(str(m)) for m in test_msgs)
        print(f"  Sending {len(test_msgs)} messages (~{total_chars:,} chars)")

        before = time.time()
        r = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[
                {"role": "system", "content": "You are a test assistant. Respond with exactly one word."},
                *test_msgs,
                {"role": "user", "content": "Say exactly: done"}
            ],
            max_tokens=5,
            temperature=0,
        )
        elapsed = time.time() - before
        content = r.choices[0].message.content if r.choices else "(empty)"
        print(f"  Response: {content}")
        print(f"  Elapsed: {elapsed:.2f}s")
        usage = getattr(r, "usage", None)
        if usage:
            print(f"  Tokens: {usage.prompt_tokens:,} in → {usage.completion_tokens:,} out")
            print(f"  Token rate: {usage.completion_tokens/max(elapsed, 0.1):.1f} tok/s")
    except Exception as e:
        print(f"  FAILED: {e}")

# ── 4. Check WAL state ──────────────────────────────────────────────────────
print("\n=== State DB ===")
db_path = os.path.expanduser("~/.hermes/state.db")
try:
    conn = sqlite3.connect(db_path, timeout=2)
    msgs_count = conn.execute("SELECT COUNT(*) FROM messages").fetchone()[0]
    sessions_count = conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
    conn.close()
    print(f"  Sessions: {sessions_count}, Messages: {msgs_count}")
except Exception as e:
    print(f"  Error: {e}")

wal_path = db_path + "-wal"
if os.path.exists(wal_path):
    wal_size = os.path.getsize(wal_path)
    frames = (wal_size - 32) // 4120 if wal_size > 32 else 0
    print(f"  WAL: {wal_size//1024} KB ({frames} frames)")

print("\nDone. Compare Test 1 vs Test 3 times to see if API latency scales with context size.")
