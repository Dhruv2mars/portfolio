# AI Activity is published nightly from the author Mac into Vercel Blob

Home’s hero figure is a read model: daily combined token totals for the calendar year to date.
Authoritative history (through yesterday, `Asia/Kolkata`) is produced by a local `tokscale`
export and published once nightly to Vercel Blob via `POST /api/ai-activity/ingest`.

The public app never holds provider secrets. It fetches the published JSON (with ISR
revalidation) and falls back to `data/ai-activity.fallback.json` if Blob is unreachable.

“Today” is not ingested during the day, and nothing is invented to stand in for it. The curve
simply runs to the last day it has, and the 15-day triangular smoothing that draws it conserves
mass at both ends, so a part-measured today cannot make the year fade out.

Failure mitigation lives on the Mac agent: retries on publish, local `last-good.json`,
LaunchAgent nightly + RunAtLoad catch-up when the last success is stale (>26h).

The heatmap this read model was first built for is gone — see ADR-0007. The pipeline is unchanged;
only its consumer is.
