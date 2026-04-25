# temptools 🛠️

Temporary diagnostic and utility scripts — ad-hoc tools for investigating
behaviour, performance, and system state.  Not part of any project workflow.

## Naming Convention

- `diagnose-<issue>.sh` — runnable snapshot scripts for specific problems
- `profile-<target>.py` — targeted Python profiling
- `analyze-<target>.py` — data analysis of logs/config/state

## Usage

```bash
./diagnose-slowdown.sh
```

Run from anywhere — scripts are self-contained and reference absolute paths.
