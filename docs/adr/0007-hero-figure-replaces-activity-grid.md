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

Remove the grid. Draw the same read model as the hero figure: this calendar year, January 1 to the
last day the payload measured, one line, smoothed on a 15-day triangular kernel that conserves mass
so the curve cannot show a peak that was not worked or dip below a day that was zero.

The right edge is the record's, not the calendar's. A day the meter reported as zero is a measured
zero and is drawn; a day past the end of the payload was never measured at all. Filling those with
zero — which is what a window that always ran to today would do — draws a collapse that never
happened and then drags the real tail down with it through the smoothing kernel. A stale fixture
would therefore be rendered as a week of not working.

The nightly `tokscale` → Vercel Blob pipeline is unchanged. It was never the grid's — it is a
published read model, and the figure is now its only consumer on Home.

## Consequences

- One shape instead of 365. The figure answers how much and which way, which is the question the
  measurements can actually answer well.
- No roving tabindex, no live region, no arrow-key note. The figure carries a written description
  of what it shows, including its smoothing window, which is what a non-sighted reader needs and
  is cheaper than making a grid walkable.
- `LEVEL_ALPHA` survives — the 404 glyph still uses it — and so do the month/date formatters, for
  the figure's month row and its written description. They live in `lib/figure.ts` now, and the CSS
  class is `.glyph-cell`: the old names described a grid this ADR deleted.
- `data/ai-activity.fallback.json`, the ingest route, and the LaunchAgent are all untouched.
- A stale source shortens the figure instead of flattening it. The month row and the figure's
  written description both stop on the same day, because `series.to` is what feeds them.
- In the degenerate case — a payload with nothing at all in the current year — the window is the
  single day it opens on. That is a broken pipeline showing as a broken figure, which is the right
  failure: the alternative is a full-width flat line made entirely of numbers nobody measured.
