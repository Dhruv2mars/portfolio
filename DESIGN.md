# Design contract

Read before touching code. Supersedes the retired LEDGER contract (see `docs/adr/0005`).

## 0. Relationship to the Reference

chanhdai.com (`ncdai/chanhdai.com`) is the bar. We build in its idiom on purpose. Two rules govern what transfers:

**Adopt — the design language.** Dark-first with a real light theme. Geist Sans + Geist Mono. Small
type, tight tracking, generous line-height. Hairline borders instead of shadows. Quiet chrome that
never competes with content. Motion that is short, purposeful, and never decorative. A dense single
scroll on Home. A command palette as a craft signal. Pixel discipline everywhere.

**Do not adopt — the information architecture.** No component registry, no blocks, no sponsors, no
awards, no certifications, no testimonials, no bookmarks. Those sections work there because they are
full. We have four things worth showing and we show four things.

**Write our own code.** This is a rebuild in a shared idiom, not a fork and not a transcription. No
file is copied from the Reference. Its name, logo, avatar, copy, and personal data appear nowhere.

The failure mode to design against is not "looks similar" — it is **an impressive frame around thin
content**. Every section must be dense with real Proof or it does not exist.

## 1. Stack

Next.js (App Router) · React · TypeScript · Tailwind v4 · Motion for animation · `next-themes` ·
MDX via `next-mdx-remote` with `rehype-sanitize` · `sugar-high` for code · Vercel. Latest stable at
build time. `bun` for everything.

**No component library.** Every primitive here — panel, icon set, command palette, menu, tabs, the
search field — is written in this repo. A dependency earns its place by doing something we cannot:
Motion does springs, `next-themes` does the no-flash theme boot. A dropdown does not qualify.

## 2. Surfaces

```
/                    Masthead → Overview → AI Activity → Projects → Blog → footer
/projects            every Project, one panel, filtered
/blog                every Post, one panel, filtered
/blog/[slug]         Post
/blog/[slug]/raw.md  the Post as source, for a reader or a model
/feed.xml            RSS                    ← survives from the old build
/writings            301 → /blog            ← survives from the old build
/og                  dynamic OG images
/sitemap.xml /robots.txt
404
```

`/projects` and `/blog` are the same page twice: one panel, an `h1` carrying the count, one search
field, one kind of row. A Visitor who has used either has learned both. Home shows the head of each
list and a door to the rest.

`rehype-sanitize` on all MDX and escaped JSON-LD embedding survive from the old build unchanged.
Regressing either is a security bug, not a style change.

## 3. Masthead

One block, no hero. Avatar slot · name, with a button that pronounces it · the tagline, flipping
through the several ways it is true. The social links live in the Overview panel below, where they
are the panel's whole content: a location and a clock were tried there and removed, because neither
changed what a reader does next.

**The plate carries the record, not an ornament.** The masthead's figure plate held an isometric
drawing that meant nothing; it now holds the same measurements the activity grid holds, drawn as one
curve. The window is fixed by the calendar — January 1 to today, so the figure is the same shape
tomorrow as it is now and one quiet fortnight cannot crop it. The series is smoothed on a 15-day
triangular window, stated in the figure's description and never hidden — the caption is pared to
`Fig. 1.` because the year is legible off the month row and a plate does not need to narrate itself,
but a smoothed curve that says nowhere that it is smoothed is the one lie a chart can tell quietly.
Mass is conserved across the smoothing, including at both ends, and the interpolation is monotone
cubic, so the curve cannot invent a peak or dip below a real zero.

The scale is set inside the plot rather than in a gutter beside it: labelled levels on round numbers,
each followed by a short stub, and nothing else. No gridlines, no axis rules, no tooltip — a hero is
looked at, not interrogated, and §4's grid is where a day is read off. No full-bleed rule crosses the
plate either: the panels below rule the page edge to edge, and one run across here would cut the
figure in half at the height of the monogram. The curve arrives as a left-to-right wipe because the
record accumulates in that order.

**The figure is a range at a distance, standing on a floor.** That is the target, and it decides the
cosmetics. A crisp hairline reads as a drawn contour; a range seen across a valley is a silhouette
whose top edge happens to be a line, so the stroke goes under a pixel, the wash under it carries the
mass, and a half-pixel of blur takes the cusps off the peaks. The blur is the only honest way to
soften them: `monotone` is what guarantees the curve never invents a peak, so the geometry is never
touched and only its edge is hazed. The labels stand in the same air at a quarter of that. Under it
all, a ground wash rises from the plate's bottom edge and thins out before the ridge meets it — the
month row lands on that floor, which is the nearest thing in the picture.

**The figure sits at a distance.** It is behind the name and behind the monogram, and it is drawn
that way: the ink is mixed toward the background rather than faded with alpha, so contrast collapses
toward the colour of the air the way distance actually works and the line walks toward near-black in
dark and near-white in light instead of merely thinning. The curve holds roughly 4.6:1 against its
background; the name above it holds 19:1, and that ordering is the point. The scale and month labels
step back too, but a shorter step — recede the reading as far as the drawing and the plate stops
being a record and becomes a texture. None of this is AA text: the plate is one `role="img"` and the
description carries the reading in words.

**The hero is its own case.** It is the one plate on the site judged on its own terms rather than
against the panel idiom: it is the first thing seen, it is a picture before it is a table, and the
rules that keep the panels below it quiet are the wrong rules for it. §7's prohibitions are written
for the page under the masthead.

**The avatar slot is a designed absence.** No portrait exists yet. Reserve the exact final footprint
and render a bordered placeholder that carries the same cursor-tracking light interaction a real
photo would. Empty shape, live behaviour. Dropping in a portrait later must be a one-line change with
zero layout shift. It must never read as a broken image.

## 4. AI Activity

The density anchor and the largest element above the fold. A year grid of day cells, intensity by
token count, with a hover/focus readout carrying the exact value — the readout is a fixed line, not a
floating tooltip, so nothing reflows.

A band of totals — all time, 30 days, 7 days, today — stood above the grid and was removed. It
restated the picture under it in figures and cost a band of the page to do it, and a lifetime number
is a milestone rather than a measurement: it goes up and never comes down, so it says nothing about
whether the habit is still alive. The readout carries the exact value for any day worth asking about,
and §3's curve carries the shape.

- Server-rendered with the real measurements in the HTML before hydration. No skeleton, no
  client-only fetch, no hydration mismatch.
- One SVG, not hundreds of nodes. Grid semantics with a per-cell accessible name.
- Full keyboard traversal; the readout is an `aria-live` region.
- Below the tablet breakpoint the grid re-orients to a month matrix rather than scrolling
  horizontally. Every cell has a ≥24×24 hit area.
- Source order is tokscale → Vercel Blob → fixture. The `tokscale-sync` CLI publishes daily totals to
  a public Worker read API; the blob is the previous pipeline, kept as a fallback.
- Fixture fallback renders identically and is labelled `fixture`. Data is never invented.

## 5. Projects

Eight, curated, in this order. Tier 1 is the agentic thesis; Tier 2 earns its place on shipped craft.

```
01  relunar     CLI repro harness for coding agents          relunar.com
02  pi-queue    FIFO queue and steering for pi               published on npm
03  offdex      Local-first Codex across phone, web, native
04  gunmetal    Local OpenAI-compatible API over your existing subscriptions
05  mdv-ts      Terminal markdown editor, TypeScript + OpenTUI
06  block       WebGPU generative logo explorer              live demo
07  codexchat   Subscription-backed inference chat, Rust
08  openutm-v0  Cross-platform UTM alternative
```

Rows, not cards — mark, name, one line, and language, standing, and year as pills. The whole row is
one door to the thing itself; a Project whose live address is not its repository gets a second small
door to the source. Hover reveals the destination host. A Project's own mark is checked into
`public/projects` and drawn as a mask in the row's ink; a Project without one gets the glyph for its
kind. No thumbnails, no detail pages, no screenshots.

Nothing on a row is disclosed. An index of eight rows that shows eight names and eight identical
years is not an index, and a search field that matches hidden text is a trick.

`pi-queue` shows **"published on npm"** as a fact and never a download counter — the real number is
too small to help. Revisit if relunar gains traction.

## 5b. Blog

Rows, not cards: date, title, one line, reading time. A card grid with no images is a list wearing a
costume.

A Post page is a document you can do something with. Above the title: back to the index, copy the
Post as Markdown, hand it to a model, share it, and step to the Post either side (`←` / `→`, which
bail on modifier keys and on any field that has focus). The arrows are labelled **Newer** and
**Older**, never Previous/Next — in a reverse-chronological list those words are a coin toss.

The contents list sits at the front of the Post rather than floating in the margin: this frame is
one railed column and has no margin. It is drawn only when there are at least two headings, and it
does not track the reading position — it is an index, not chrome.

## 6. Type, colour, motion

**Type.** Geist Sans for language, Geist Mono for data and chrome (numbers, dates, labels, nav,
metadata, code). Tabular numerals globally — no number column ever reflows. Six sizes, no seventh.
Uppercase reserved for section labels only.

**Colour.** Dark is default and primary; light is a real design, not an inversion. Near-black rather
than pure black, near-white rather than pure white. One accent, used sparingly and enumerated in
code. Both themes must pass WCAG AA for all text; heatmap ramp steps below AA are never the sole
carrier of meaning — the readout always states the value.

**Motion.** Short and purposeful: hover ~150ms, entrance ~350ms, theme ~250ms. `Motion` is used only
where CSS genuinely cannot do the job. Nothing animates perpetually. Nothing parallaxes, pins, or
jacks the scroll. `prefers-reduced-motion` removes movement but keeps colour-only interaction
feedback.

## 7. Prohibitions

No empty sections. No placeholder or invented data. No "coming soon". No fake metrics. No box
shadows outside the one popover surface (a menu must detach from the page under it). No gradients
except the heatmap ramp and the hero's own fill (§3). No thumbnails or project detail pages. No hamburger
menu. No perpetual animation. No page-level fade on route change. No dashboard grammar.

## 8. Acceptance tests

1. `curl` of `/` contains the real per-day token counts; console shows no hydration mismatch.
2. At 1440×900 the masthead and the complete year grid are visible without scrolling.
3. Zero horizontal scroll at 390, 768, 1024, 1280, 1440, 2560.
4. Every interactive target ≥24×24 at 390. Heatmap cells are the one
   exception WCAG 2.5.8 allows — a calendar grid's cell size is essential to
   its presentation, and the grid is reachable as a single tab stop.
5. Full keyboard traversal of the heatmap, with the readout announced.
6. Both themes pass their stated contrast ratios.
7. Two screenshots taken 5s apart are pixel-identical (no perpetual motion).
8. No section renders with zero real items — including Blog, which stays hidden at zero Posts.
9. Lighthouse: performance ≥95, accessibility 100, best practices 100, SEO 100. CLS = 0.
10. `/writings` still permanent-redirects to `/blog` (Next emits 308, which
    preserves the method); `/feed.xml` still validates.
11. Every link in a Post's contents list resolves to a heading id that the MDX
    renderer actually emitted — one `slugify`, in `lib/slug.ts`, imported by
    both.
12. `/blog/[slug]/raw.md` serves `text/markdown` and contains no frontmatter.
