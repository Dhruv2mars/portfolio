# AI Activity (nightly tokscale → Vercel Blob)

## What it does

1. **Nightly (00:20 local)** and **on login if stale (>26h)**: Mac runs `scripts/sync-ai-activity.ts`
2. Syncs Cursor into tokscale (best-effort), exports combined daily totals **through yesterday** (`Asia/Kolkata`)
3. `POST /api/ai-activity/ingest` with a shared secret → overwrites `ai-activity/latest.json` in Vercel Blob
4. Site reads Blob (falls back to `data/ai-activity.fallback.json`)
5. **Today** on the heatmap is a conservative live estimate: `min(last ≤7 positive days) × day fraction`, with a ~90s count-up on hover

No git push. No hourly jobs.

## One-time Vercel setup

1. In the Vercel project: Storage → create a **Blob** store → connect to the project  
2. Env vars (Production + Preview if you want):

```bash
BLOB_READ_WRITE_TOKEN=...          # from the Blob store
AI_ACTIVITY_INGEST_SECRET=...      # long random string you choose
AI_ACTIVITY_BLOB_URL=...           # public URL of ai-activity/latest.json (from first ingest)
```

Set `AI_ACTIVITY_BLOB_URL` after the first successful ingest (response includes `url`), or copy it from the Blob store UI.

3. Redeploy so the ingest route sees the env vars.

## One-time Mac setup

```bash
mkdir -p ~/.config/portfolio-ai-activity
cat > ~/.config/portfolio-ai-activity/env <<'EOF'
AI_ACTIVITY_INGEST_URL=https://dhruv2mars.com/api/ai-activity/ingest
AI_ACTIVITY_INGEST_SECRET=same-as-vercel
EOF
chmod 600 ~/.config/portfolio-ai-activity/env

bun run ai-activity:install-agent
AI_ACTIVITY_FORCE=1 bun run ai-activity:sync
```

State / logs live under `~/.config/portfolio-ai-activity/` (`last-good.json`, `status.json`, launchd logs).

## Failure mitigation

| Failure | Behavior |
|---------|----------|
| Cursor sync fails | Continues with other local agents |
| Publish network error | 3 retries with backoff; keeps previous Blob object |
| Publish still fails | `last-good.json` retained; site keeps serving last Blob / fallback |
| Mac asleep at 00:20 | `RunAtLoad` catch-up on next login if success older than 26h |
| Blob missing on site | `data/ai-activity.fallback.json` |

## Manual commands

```bash
bun run ai-activity:sync          # no-op if fresh
bun run ai-activity:sync:force    # always run
```
