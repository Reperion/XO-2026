# T4 Specification: XO Self-Improvement (Top 2 Priorities)

## Priority #1: Install honcho for Enhanced Memory

### Objective
Install and integrate the `honcho` skill to provide cross-session memory capabilities, complementing XO's existing memory + session_search system.

### Background
- T1 Audit identified XO's weakness: "Self-Improvement: Low (reactive, not proactive)"
- T2 Research found `honcho` (official/autonomous-ai-agents/honcho) with "High" impact, "Low" effort
- Current memory system: Core memory (8K chars) + External MEMORY.md + session_search

### Implementation Steps

1. **Install honcho skill**
   ```bash
   yes | hermes skills install official/autonomous-ai-agents/honcho
   ```

2. **Verify installation**
   ```bash
   hermes skills list --source hub | grep honcho
   skill_view(name='honcho')
   ```

3. **Test honcho memory**
   - Write a test memory entry via honcho
   - Retrieve it in a new session (simulate with `hermes chat --new`)
   - Verify persistence

4. **Integrate with XO's memory system**
   - Update memory saving workflow to also save to honcho
   - Decide what goes to core memory vs. honcho vs. session_search
   - Document in MEMORY.md

### Success Criteria
- [ ] honcho skill installed and appears in `hermes skills list --source hub`
- [ ] Can write and retrieve memory entries across sessions
- [ ] No conflicts with existing memory system (core memory, MEMORY.md, session_search)
- [ ] Integration documented in `/home/lucid/xo/MEMORY.md`

### Risks
- **Conflict with existing memory**: honcho might duplicate or conflict with core memory
- **Mitigation**: Test thoroughly before integrating with XO's main workflow

### Verification
```bash
# Test write
# (Use honcho skill to write test memory)

# Test read (in new session)
hermes chat --new
# (Use honcho skill to read test memory)
```

---

## Priority #2: Improve xo-proposal-system with Inline Buttons

### Objective
Upgrade the Telegram proposal system to use inline keyboard buttons (Approve/Reject) instead of text replies, improving user experience and reliability.

### Background
- Current system: Send proposal text, Mike replies with "approve"/"reject" text
- Issues: Text replies can be ambiguous, no visual feedback, easy to mis-type
- Solution: Use Telegram `InlineKeyboardMarkup` with Approve/Reject buttons

### Implementation Steps

1. **Study Telegram Inline Keyboard API**
   - Review: https://core.telegram.org/bots/api#inlinekeyboardmarkup
   - Understand: `reply_markup`, `InlineKeyboardButton`, `callback_data`

2. **Update proposal sending code**
   - File: `/home/lucid/xo/scripts/telegram_approval_check.py` (or create if not exists)
   - Modify `send_proposal()` function to include `reply_markup`:
     ```python
     reply_markup = {
         "inline_keyboard": [[
             {"text": "✅ Approve", "callback_data": "approve"},
             {"text": "❌ Reject", "callback_data": "reject"}
         ]]
     }
     # Add to sendMessage payload
     ```

3. **Add callback query handler**
   - Create `/home/lucid/xo/scripts/telegram_callback_handler.py`
   - Listen for `callback_query` updates
   - Extract `callback_data` ("approve" or "reject")
   - Write to approval flag file (`/home/lucid/xo/proposal_X_approved.txt` or `rejected.txt`)

4. **Update proposal tracking**
   - Modify `/home/lucid/xo/skills-inventory.md` (xo-core/xo-proposal-system)
   - Update SKILL.md with inline button instructions
   - Add callback handler to cron job workflow

5. **Test end-to-end**
   - Send test proposal with inline buttons
   - Click "Approve" button
   - Verify callback received and flag file written
   - Check that button click shows visual feedback (optional: answer callback with popup)

### Success Criteria
- [ ] Proposals sent with Approve/Reject inline buttons
- [ ] Clicking button triggers callback query
- [ ] Callback properly detected and processed (flag file written)
- [ ] Visual feedback works (button changes to ✅ Approved or ❌ Rejected)
- [ ] Updated xo-proposal-system skill documented with new workflow
- [ ] Tested with Mike (real proposal)

### Risks
- **Telegram API changes**: Inline keyboard API might change
- **Mitigation**: Use stable API v6.0+, test thoroughly
- **Callback query not received**: Updates might be cleared before we read them
- **Mitigation**: Use `getUpdates` with `allowed_updates=["callback_query"]`

### Code Template

**Sending proposal with buttons:**
```python
import requests

BOT_TOKEN = "8229408346:AAFu2s7vCeiF04Ig3f3ye2ZZU9iUJHuJzWs"
CHAT_ID = "8550634232"

def send_proposal_with_buttons(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "reply_markup": {
            "inline_keyboard": [[
                {"text": "✅ Approve", "callback_data": "approve"},
                {"text": "❌ Reject", "callback_data": "reject"}
            ]]
        }
    }
    response = requests.post(url, json=payload)
    return response.json()
```

**Handling callback:**
```python
def handle_callback(update):
    callback = update.get("callback_query", {})
    data = callback.get("data")  # "approve" or "reject"
    message_id = callback.get("message", {}).get("message_id")
    
    if data == "approve":
        with open(f"/home/lucid/xo/proposal_approved.txt", "w") as f:
            f.write(f"Approved at {datetime.now()}")
    elif data == "reject":
        with open(f"/home/lucid/xo/proposal_rejected.txt", "w") as f:
            f.write(f"Rejected at {datetime.now()}")
    
    # Answer callback (visual feedback)
    answer_callback(callback.get("id"), f"{'✅' if data == 'approve' else '❌'} {data}d")
```

---

## Summary

| Priority | Improvement | Est. Effort | Success Metric |
|----------|--------------|--------------|----------------|
| #1 | Install honcho | 30 min | honcho installed, cross-session memory works |
| #2 | Proposal buttons | 1-2 hours | Proposals have Approve/Reject buttons, callbacks work |

## Next Steps
- T5 (xo): Implement Priority #1 (honcho installation)
- T6 (xo): Implement Priority #2 (proposal buttons)
- Future: T7, T8 for Priority #3, #4, #5

---

*Specification drafted based on T3 Synthesis Roadmap.*
