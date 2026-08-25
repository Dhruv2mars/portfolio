# The hero figure replaces the AI Activity grid

Status: accepted. Supersedes the heatmap consequence in ADR-0005 and the AI Activity section in
the IA of ADR-0002.

## Context

ADR-0005 kept the AI Activity heatmap because it occupies the slot the reference gives its GitHub
contribution graph, and because it is the one dense dataset this site has that the reference does
not. Both of those were true about the *data*. Neither turned out to be true about the *grid*.

A year of squares answers one question — did anything happen on this day — and for this record the
answer is yes, nearly every day. The panel spent a full screen saying so. The intensity ramp
compressed a range of three orders of magnitude into five steps, so the days that were actually
different from each other were drawn the same. And a grid of 365 targets had to be made reachable
by keyboard, which cost an arrow-key roving-tabindex, a live region, and a handwritten note in the
margin explaining that the arrow keys walk the grid — chrome that existed only because the shape
did.

## Decision

Remove the grid. Draw the same read model as the hero figure: this calendar year, January 1 to
today, one line, smoothed on a 15-day triangular kernel that conserves mass so the curve cannot
show a peak that was not worked or dip below a day that was zero.

The nightly `tokscale` → Vercel Blob pipeline is unchanged. It was never the grid's — it is a
published read model, and the figure is now its only consumer on Home.

## Consequences

- One shape instead of 365. The figure answers how much and which way, which is the question the
  measurements can actually answer well.
- No roving tabindex, no live region, no arrow-key note. The figure carries a written description
  of what it shows, including its smoothing window, which is what a non-sighted reader needs and
  is cheaper than making a grid walkable.
- `LEVEL_ALPHA` survives in `lib/activity-grid.ts` — the 404 glyph still uses it. The
  month/date formatters survive there too, for the figure's month row and its description.
- `data/ai-activity.fallback.json`, the ingest route, and the LaunchAgent are all untouched.
