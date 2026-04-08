#!/bin/bash
# XO-2026 Sync Script — Pushes local workspace state to GitHub
# Run from /home/lucid/xo/

GIT_DIR="/home/lucid/xo"
REMOTE="origin"
BRANCH="main"

echo "XO Sync at $(date)"

cd "$GIT_DIR" || exit 1

# Check git status
if git status --porcelain | grep -q .; then
    git add .
    if git commit -m "XO sync $(date +'%Y-%m-%d %H:%M')"; then
        git push "$REMOTE" "$BRANCH"
        echo "Push successful."
    else
        echo "Nothing to commit."
    fi
else
    echo "No changes to sync."
fi
