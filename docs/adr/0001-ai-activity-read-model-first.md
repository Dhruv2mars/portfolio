# AI Activity is published nightly from the author Mac into Vercel Blob

Home’s AI Activity heatmap is a read model: daily combined token totals + derived intensity.
Authoritative history (through yesterday, `Asia/Kolkata`) is produced by a local `tokscale`
export and published once nightly to Vercel Blob via `POST /api/ai-activity/ingest`.

The public app never holds provider secrets. It fetches the published JSON (with ISR
revalidation) and falls back to `data/ai-activity.fallback.json` if Blob is unreachable.

“Today” is not ingested during the day. The client shows a conservative live projection:
`min(last ≤7 positive days) × fraction of local day elapsed`, with a short count-up on hover.

Failure mitigation lives on the Mac agent: retries on publish, local `last-good.json`,
LaunchAgent nightly + RunAtLoad catch-up when the last success is stale (>26h).
