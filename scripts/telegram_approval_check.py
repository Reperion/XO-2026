#!/usr/bin/env python3
"""
Telegram Approval Checker for XO Proposals
Checks for replies to XO's proposal messages, logs approvals/rejections.
"""
import requests
import json
import os
import sys
from datetime import datetime

# Load from memory or env (in real use, these are in memory)
BOT_TOKEN = "8229408346:AAFu2s7vCeiF04Ig3f3ye2ZZU9iUJHuJzWs"
CHAT_ID = "8550634232"
PROPOSAL_MSG_ID = 664  # First proposal: AGENTS.md auto-gen
LAST_UPDATE_FILE = "/home/lucid/xo/telegram_last_update.txt"

def get_updates():
    """Fetch recent Telegram updates."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Error fetching updates: {e}")
        return None

def load_last_update_id():
    """Load last processed update ID to avoid reprocessing."""
    if os.path.exists(LAST_UPDATE_FILE):
        with open(LAST_UPDATE_FILE, 'r') as f:
            return int(f.read().strip())
    return 0

def save_last_update_id(update_id):
    """Save last processed update ID."""
    with open(LAST_UPDATE_FILE, 'w') as f:
        f.write(str(update_id))

def check_proposal_replies():
    """Check for replies to proposal messages."""
    updates = get_updates()
    if not updates or not updates.get('ok'):
        return
    
    last_update_id = load_last_update_id()
    results = updates.get('result', [])
    
    for msg in reversed(results):  # Process newest first
        update_id = msg.get('update_id', 0)
        if update_id <= last_update_id:
            continue
        
        message = msg.get('message', {})
        reply_to = message.get('reply_to_message', {})
        # Check if this is a reply to XO's proposal (message_id 664)
        if reply_to.get('message_id') == PROPOSAL_MSG_ID:
            text = message.get('text', '').lower()
            if any(word in text for word in ['approve', 'yes', 'ok', 'go']):
                print(f"[{datetime.now()}] Proposal 1 APPROVED: {text}")
                # Trigger proposal execution (auto-generate AGENTS.md)
                # This will be handled by XO's next session
                with open("/home/lucid/xo/proposal_1_approved.txt", 'w') as f:
                    f.write(f"Approved at {datetime.now()}\nReply: {text}")
                # Send confirmation to Mike
                send_msg = requests.post(
                    f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                    data={"chat_id": CHAT_ID, "text": "XO: Proposal 1 approved, starting execution."}
                )
            elif any(word in text for word in ['reject', 'no', 'deny']):
                print(f"[{datetime.now()}] Proposal 1 REJECTED: {text}")
                with open("/home/lucid/xo/proposal_1_rejected.txt", 'w') as f:
                    f.write(f"Rejected at {datetime.now()}\nReply: {text}")
        
        save_last_update_id(update_id)

if __name__ == "__main__":
    check_proposal_replies()
