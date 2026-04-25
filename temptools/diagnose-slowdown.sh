#!/bin/bash
# diagnose-slowdown.sh
# Snapshot diagnostics for "chat gets slow after 10-20 prompts" issue.
# Run this the MOMENT you notice slowdown to capture the state.
set -euo pipefail

echo "=== DIAGNOSE SLOWDOWN ==="
echo "Timestamp: $(date -Iseconds)"
echo ""

# 1. WAL file size (indicator of SQLite write pressure)
echo "--- state.db WAL ---"
wal="/home/lucid/.hermes/state.db-wal"
if [ -f "$wal" ]; then
    size=$(stat --format=%s "$wal")
    echo "WAL size: $((size / 1024)) KB"
    # frames = (size - 32) / (4096 + 24)
    frames=$(( (size - 32) / 4120 ))
    echo "WAL frames: $frames"
else
    echo "WAL: not found"
fi
echo ""

# 2. Process CPU/RSS for hermes processes
echo "--- Hermes processes ---"
ps -eo pid,ppid,%cpu,%mem,rss,etime,args --sort=-%cpu \
    | grep -E "(hermes|python)" \
    | grep -v grep \
    | head -10
echo ""

# 3. Gateway uptime
echo "--- Gateway ---"
if [ -f /home/lucid/.hermes/gateway.pid ]; then
    gw_pid=$(cat /home/lucid/.hermes/gateway.pid)
    if kill -0 "$gw_pid" 2>/dev/null; then
        echo "Gateway PID: $gw_pid"
        ps -p "$gw_pid" -o etime,pid,rss,args --no-headers 2>/dev/null
    else
        echo "Gateway PID file exists but process not running"
    fi
else
    echo "Gateway not running"
fi
echo ""

# 4. Thread count for CLI process
echo "--- CLI threads ---"
cli_pid=$(ps -eo pid,args --no-headers | grep -E "hermes$" | head -1 | awk '{print $1}')
if [ -n "$cli_pid" ]; then
    threads=$(ls /proc/$cli_pid/task/ 2>/dev/null | wc -l)
    echo "CLI PID: $cli_pid, Threads: $threads"
else
    echo "CLI process not found"
fi
echo ""

# 5. Total messages in state.db
echo "--- Session DB stats ---"
python3 -c "
import sqlite3
try:
    conn = sqlite3.connect('/home/lucid/.hermes/state.db', timeout=2)
    msgs = conn.execute('SELECT COUNT(*) FROM messages').fetchone()[0]
    sessions = conn.execute('SELECT COUNT(*) FROM sessions').fetchone()[0]
    conn.close()
    print(f'Sessions: {sessions}, Messages: {msgs}')
except Exception as e:
    print(f'DB error: {e}')
" 2>/dev/null || echo "DB not accessible"
echo ""

# 6. OpenRouter latency test (quick ping)
echo "--- API latency test ---"
api_start=$(date +%s%N)
response=$(curl -s -o /dev/null -w "%{http_code} %{time_total}s" \
    --max-time 5 \
    https://openrouter.ai/api/v1/models 2>/dev/null) || response="FAILED"
echo "OpenRouter models endpoint: $response"
api_end=$(date +%s%N)
echo ""

# 7. Checkpoint count for current working directory
echo "--- Checkpoints ---"
for d in /home/lucid/.hermes/checkpoints/*/; do
    if [ -f "$d/HEAD" ]; then
        commits=$(cd "$d" && git rev-list --count HEAD 2>/dev/null || echo "?")
        wdir=$(cat "$d/HERMES_WORKDIR" 2>/dev/null || echo "?")
        echo "  $commits commits for $wdir"
    fi
done
echo ""

# 8. Filesystem activity
echo "--- Recent log writes ---"
for f in /home/lucid/.hermes/logs/{agent,errors,gateway}.log; do
    if [ -f "$f" ]; then
        size=$(stat --format=%s "$f" 2>/dev/null)
        mtime=$(stat --format=%y "$f" 2>/dev/null | cut -d. -f1)
        echo "$(basename $f): $((size/1024)) KB, modified $mtime"
    fi
done
echo ""

echo "=== END DIAGNOSE ==="
