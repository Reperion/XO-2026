#!/usr/bin/env python3
"""
Telegram Approval System for XO Proposals
- Sends proposals with inline Approve/Reject buttons
- Handles callback queries from button clicks
- Checks for text replies (fallback)
"""

import requests
import json
import os
import sys
from datetime import datetime

# Load from memory or env (in real use, these are in memory)
BOT_TOKEN="8229408346:AAFu2s7vCeiF04Ig3f3ye2ZZU9iUJHuJzWs"
CHAT_ID="8550634232"
LAST_UPDATE_FILE = "/home/lucid/xo/telegram_last_update.txt"
PROPOSAL_TRACKING_DIR = "/home/lucid/xo/proposals"

def ensure_tracking_dir():
    """Ensure proposal tracking directory exists."""
    os.makedirs(PROPOSAL_TRACKING_DIR, exist_ok=True)

def send_proposal_with_buttons(proposal_id, text):
    """Send a proposal with inline Approve/Reject buttons."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": f"📋 **Proposal #{proposal_id}**\n\n{text}",
        "parse_mode": "Markdown",
        "reply_markup": {
            "inline_keyboard": [[
                {"text": "✅ Approve", "callback_data": f"approve_{proposal_id}"},
                {"text": "❌ Reject", "callback_data": f"reject_{proposal_id}"}
            ]]
        }
    }
    
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        result = resp.json()
        if result.get("ok"):
            message_id = result["result"]["message_id"]
            print(f"[{datetime.now()}] Sent proposal #{proposal_id} (msg_id: {message_id})")
            # Track the proposal
            track_proposal(proposal_id, message_id, text)
            return message_id
        else:
            print(f"[{datetime.now()}] Failed to send proposal: {result}")
            return None
    except Exception as e:
        print(f"[{datetime.now()}] Error sending proposal: {e}")
        return None

def track_proposal(proposal_id, message_id, text):
    """Save proposal metadata for tracking."""
    ensure_tracking_dir()
    tracking_file = os.path.join(PROPOSAL_TRACKING_DIR, f"{proposal_id}.json")
    data = {
        "id": proposal_id,
        "message_id": message_id,
        "text": text,
        "sent_at": datetime.now().isoformat(),
        "status": "pending"
    }
    with open(tracking_file, 'w') as f:
        json.dump(data, f, indent=2)

def answer_callback(callback_id, text):
    """Send answer to callback query (visual feedback)."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/answerCallbackQuery"
    payload = {
        "callback_query_id": callback_id,
        "text": text,
        "show_alert": False
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        return resp.json().get("ok", False)
    except Exception as e:
        print(f"[{datetime.now()}] Error answering callback: {e}")
        return False

def handle_callback_query(callback):
    """Process a callback query from inline button click."""
    callback_id = callback.get("id")
    data = callback.get("data", "")  # e.g., "approve_5" or "reject_5"
    message = callback.get("message", {})
    message_id = message.get("message_id")
    
    if "_" not in data:
        return
    
    action, proposal_id = data.split("_", 1)
    
    # Update proposal status
    tracking_file = os.path.join(PROPOSAL_TRACKING_DIR, f"{proposal_id}.json")
    if os.path.exists(tracking_file):
        with open(tracking_file, 'r') as f:
            proposal = json.load(f)
        
        if action == "approve":
            proposal["status"] = "approved"
            proposal["approved_at"] = datetime.now().isoformat()
            # Write approval flag
            approval_file = f"/home/lucid/xo/proposal_{proposal_id}_approved.txt"
            with open(approval_file, 'w') as f:
                f.write(f"Approved at {datetime.now()}\nProposal: {proposal['text'][:100]}...")
            # Answer callback
            answer_callback(callback_id, f"✅ Proposal #{proposal_id} approved!")
            print(f"[{datetime.now()}] Proposal #{proposal_id} APPROVED via button")
            
        elif action == "reject":
            proposal["status"] = "rejected"
            proposal["rejected_at"] = datetime.now().isoformat()
            # Write rejection flag
            rejection_file = f"/home/lucid/xo/proposal_{proposal_id}_rejected.txt"
            with open(rejection_file, 'w') as f:
                f.write(f"Rejected at {datetime.now()}\nProposal: {proposal['text'][:100]}...")
            # Answer callback
            answer_callback(callback_id, f"❌ Proposal #{proposal_id} rejected")
            print(f"[{datetime.now()}] Proposal #{proposal_id} REJECTED via button")
        
        # Save updated proposal
        with open(tracking_file, 'w') as f:
            json.dump(proposal, f, indent=2)

def get_updates(last_update_id=0):
    """Fetch recent Telegram updates."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    params = {"timeout": 0}  # Use 0 for testing (no long poll)
    if last_update_id > 0:
        params["offset"] = last_update_id + 1
    
    try:
        resp = requests.get(url, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if data.get('ok'):
            # Filter for message and callback_query manually
            filtered = [r for r in data.get('result', []) if 'message' in r or 'callback_query' in r]
            data['result'] = filtered
        return data
    except Exception as e:
        print(f"[{datetime.now()}] Error fetching updates: {e}")
        return None

def load_last_update_id():
    """Load last processed update ID."""
    if os.path.exists(LAST_UPDATE_FILE):
        with open(LAST_UPDATE_FILE, 'r') as f:
            return int(f.read().strip())
    return 0

def save_last_update_id(update_id):
    """Save last processed update ID."""
    with open(LAST_UPDATE_FILE, 'w') as f:
        f.write(str(update_id))

def check_proposal_replies():
    """Check for both callback queries (buttons) and text replies."""
    ensure_tracking_dir()
    updates = get_updates()
    if not updates or not updates.get('ok'):
        return
    
    last_update_id = load_last_update_id()
    results = updates.get('result', [])
    
    for update in results:
        update_id = update.get('update_id', 0)
        if update_id <= last_update_id:
            continue
        
        # Handle callback queries (inline button clicks)
        if 'callback_query' in update:
            handle_callback_query(update['callback_query'])
        
        # Fallback: handle text replies (existing behavior)
        elif 'message' in update:
            message = update['message']
            reply_to = message.get('reply_to_message', {})
            text = message.get('text', '').lower()
            
            # Check if this is a reply to a proposal message
            if reply_to:
                # Try to match with tracked proposals
                for fname in os.listdir(PROPOSAL_TRACKING_DIR):
                    if fname.endswith('.json'):
                        with open(os.path.join(PROPOSAL_TRACKING_DIR, fname), 'r') as f:
                            proposal = json.load(f)
                        if proposal['message_id'] == reply_to.get('message_id'):
                            if any(word in text for word in ['approve', 'yes', 'ok', 'go']):
                                print(f"[{datetime.now()}] Proposal {proposal['id']} APPROVED via text reply")
                                proposal['status'] = 'approved'
                                with open(os.path.join(PROPOSAL_TRACKING_DIR, fname), 'w') as f:
                                    json.dump(proposal, f, indent=2)
                            elif any(word in text for word in ['reject', 'no', 'deny']):
                                print(f"[{datetime.now()}] Proposal {proposal['id']} REJECTED via text reply")
                                proposal['status'] = 'rejected'
                                with open(os.path.join(PROPOSAL_TRACKING_DIR, fname), 'w') as f:
                                    json.dump(proposal, f, indent=2)
        
        save_last_update_id(update_id)

if __name__ == "__main__":
    # Example: send a test proposal (uncomment to test)
    # send_proposal_with_buttons("test_1", "Test proposal with inline buttons")
    
    # Check for replies/callbacks
    check_proposal_replies()
