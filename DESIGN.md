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
/                    Masthead → Overview → Projects → Blog → footer
/projects            every Project, one panel, filtered
/blog                every Post, one panel, filtered
/blog/[slug]         Post
/blog/[slug]/raw.md  the Post as source, for a reader or a model
/feed.xml            RSS                    ← survives from the old build
/writings            308 → /blog            ← survives from the old build
/writings/:slug      308 → /blog/:slug       ← survives from the old build
/og                  dynamic OG images
/sitemap.xml /robots.txt
404
```

`/projects` and `/blog` are the same page twice: one panel, an `h1` carrying the count, one search
field, one kind of row. A Visitor who has used either has learned both. Home shows the head of each
list and a door to the rest.

The count on that `h1` is the number of rows under it, not the size of the corpus — the filter is
what renders it, because the filter is the only thing that knows. A heading reading "Projects 8"
above two visible rows would be the page contradicting itself in the one place a Visitor looks to
find out how much there is. It is rendered on the server from `?q`, so the first paint already
carries the filtered number rather than starting wrong and correcting itself.

**Chrome is the same on every route.** A header that keeps the mark and, above `sm`, the nav and the
palette trigger; below `sm` a floating dock that carries the nav and the trigger down to where a
thumb already is, mounted after the content so it comes last in the tab order — a control painted at
the bottom of the viewport should not sit two stops in. Under both, a fixed fade dissolves the sheet
into the background at the bottom edge: six rems deep on a phone, four above `sm`, because the phone
has a dock to float over and the desktop does not. The footer reserves exactly that depth, so the
fade lands on its own spacer and never on the last thing a Visitor was reading.

The footer is a signature: the year and the legal name, the three places the work lives plus the
feed, and the mark beneath them in the site's own alphabet. The name and the mark differ on purpose —
a copyright line names who holds it, and the signature under it is what that person is called.

**The signature is dithered, and it is small.** The mark is a field of a few thousand square dots on
a canvas, not a drawn stroke, and it is fitted to a box that stops growing at three and a half rems
of height — a signature sits under the page, so it is the last thing that should be the largest. An
invisible circle rides the cursor: a dot inside it is pushed straight out from the pointer by an
amount falling off as the cube of the distance, so the push is at full strength under the cursor and
effectively nothing at the rim, and the field has no edge for the eye to catch. Under
`prefers-reduced-motion` it renders once and listens to nothing. The dots are coordinates, checked in
at `lib/wordmark-dots.ts`; the letterforms are tuned against the drawn original with sliders in
`tools/wordmark-studio.html` and re-exported, never guessed at in code. `bun tools/gen-dots.mjs`
reproduces the checked-in file from the same engine the sliders drive, so the art is derivable from
the repository and not from a session that has since ended.

`rehype-sanitize` on all MDX and escaped JSON-LD embedding survive from the old build unchanged.
Regressing either is a security bug, not a style change.

## 3. Masthead

One block, no hero. Avatar slot · name, with a button that pronounces it · the tagline, flipping
once through the several ways it is true and then resting on the canonical one — widening a role
past a job title is a thing you say once, and §6 has no room for a masthead that never stops. The social links live in the Overview panel below, where they
are the panel's whole content: a location and a clock were tried there and removed, because neither
changed what a reader does next.

**The plate carries the record, not an ornament.** The masthead's figure plate held an isometric
drawing that meant nothing; it now holds the record itself, drawn as one
curve. The window opens on the calendar — January 1 — so one quiet fortnight cannot crop it, and it
closes on the last day the record actually measured rather than on today. A day the meter reported
as zero is inside the record and is drawn; a day past the end of the payload was never measured, and
filling it with a zero would draw a collapse that never happened and drag the real tail down with it
through the smoothing window. A stale source shortens the figure; it never flattens it. The series is smoothed on a 15-day
triangular window, stated in the figure's description and never hidden — the caption is pared to
`Fig. 1.` because the year is legible off the month row and a plate does not need to narrate itself,
but a smoothed curve that says nowhere that it is smoothed is the one lie a chart can tell quietly.
Mass is conserved across the smoothing, including at both ends, and the interpolation is monotone
cubic, so the curve cannot invent a peak or dip below a real zero.

The scale is set inside the plot rather than in a gutter beside it: labelled levels on round numbers,
each followed by a short stub, and nothing else. No gridlines, no axis rules, no tooltip — a hero is
looked at, not interrogated, and the shape of the year is the reading. A single day is not something
this page offers, because a day is not what the figure is about. No full-bleed rule crosses the
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
dark and near-white in light instead of merely thinning. Measured off the rendered page, the curve
holds 4.8:1 against its background in light and 7.6:1 in dark — one mix ratio, two ratios, because
WCAG contrast is not linear in the perceptual lightness `oklab` interpolates. The name above it
holds 19:1 in both, and that ordering is the point. The scale and month labels
step back too, but a shorter step — recede the reading as far as the drawing and the plate stops
being a record and becomes a texture. None of this is AA text: the plate is one `role="img"` and the
description carries the reading in words.

**The hero is its own case.** It is the one plate on the site judged on its own terms rather than
against the panel idiom: it is the first thing seen, it is a picture before it is a table, and the
rules that keep the panels below it quiet are the wrong rules for it. §6's prohibitions are written
for the page under the masthead.

**The avatar slot is filled.** The portrait is checked in at `public/avatar/sunny.png` and named
once in `lib/site.ts` — that field is the whole interface, and setting it back to `null` falls
through to a monogram at the identical footprint, so the slot cannot shift the layout in either
state. The slot is a square box holding a round-cropped portrait. The box draws three of its own
sides in the same hairline as every other plate on the page — top, right and bottom, each to the
box's own width and no further — and the frame supplies the fourth. Three rather than two, because
two edges leave a corner the eye falls out of and the box stops reading as a complete square; the
bottom rule is the one that closes it. The box is opaque rather than open, because the four corners
a circle does not reach would otherwise show the hero curve running through them and the mark would
read as a cutout laid over the figure instead of a plate the figure runs behind. It carries no cursor-tracking light: an earlier draft reserved that interaction for a portrait that did
not exist yet, and once a real photograph landed in the slot the effect was decoration on a face.
The portrait is loaded eagerly with explicit dimensions because it is above the fold on every route,
and a masthead that reflows when a face arrives is the failure this rule exists to prevent.

## 4. Projects

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

Rows, not cards — mark, name, and two doors. A Project's own mark is checked into `public/projects`
and drawn as a mask in the row's ink; a Project without one gets the glyph for its kind. No
thumbnails, no detail pages, no screenshots.

**A row is a name and two doors.** The name is a button that opens the record in place; the arrow
beside it is a link that leaves for the thing itself — its live address where it has one, its
repository otherwise. They are separate controls on purpose: a row that both expands and navigates
makes the reader guess which one a click bought, and one of the two answers is a lost page. The row
lights as one surface on hover because it is one thing, and the arrow darkens on its own so the
reader can see which door is under the pointer. The destination host is not revealed on hover — it
is spoken by the link's accessible name, which a pointer-only reveal would have hidden from every
reader who is not using a pointer.

**The row discloses.** Opened, it shows the Project's line of description and its language,
standing, and year as pills. Eight rows showing eight names and eight identical years is not an
index, so the year rides inside the record rather than on the closed row. The disclosure animates
`0fr → 1fr` on a grid row rather than to a measured pixel height, because the record can be one line
or three and a height the row had to measure first is a height that is wrong for one frame.

**Search matches the record, not just the name.** `searchProjects` tests name, description, kind,
note, and year — everything the row can show once opened, plus the kind that decides its glyph. A
search field that matches text a reader can never surface would be a trick; every field it matches
is reachable by opening the row it returns.

`pi-queue` and `relunar` both show **"published on npm"** as a fact and never a download counter —
the real numbers are too small to help. Revisit if either gains traction.

## 4b. Blog

Rows, not cards: title, date, reading time. A card grid with no images is a list wearing a costume.

No summary line on a row, and none under a Post's title either. The summary is written, and it is
carried — it is the description in metadata, in the feed and on a social card, which is where a
one-line précis of a piece is actually read. On the page it was a third register competing with the
title above it and the prose below it, and at the width of a full-bleed row it said less than the
title already had. So a row is a name and two facts, matching a Project row. The filter follows the
row: it matches the title and nothing else (`searchPosts`).

A Post page is a document you can do something with. Above the title: back to the index, copy the
Post as Markdown, hand it to a model, share it, and step to the Post either side (`←` / `→`, which
bail on modifier keys and on any field that has focus). The arrows are labelled **Newer** and
**Older**, never Previous/Next — in a reverse-chronological list those words are a coin toss.

There is no contents list. A Post is one railed column with no margin to float an index in, and an
index set at the front is a screenful the Visitor has to scroll past to reach the first sentence.

A word the Post defines is defined where it is first used. The source keeps its `## Definitions`
section — that is what `raw.md` serves and what a model reading the Post gets — but the page lifts
it out and puts each definition behind an info mark beside its term. The definition is in the
document either way: closed, it is the mark's own description, so it is read aloud on focus rather
than being a section at the end nobody reaches.

## 5. Type, colour, motion

**Type.** Geist Sans for language, Geist Mono for data and chrome (numbers, dates, labels, nav,
metadata, code). Tabular numerals globally — no number column ever reflows. Six sizes, no seventh.
Uppercase reserved for section labels only.

**Colour.** Dark is default and primary; light is a real design, not an inversion. Near-black rather
than pure black, near-white rather than pure white. One accent, used sparingly and enumerated in
code. Both themes must pass WCAG AA for all text. Figure 404's cell ramp runs below AA at its lower
steps and is never the sole carrier of meaning — the numeral it draws is named in the figure's alt
text, and the hero's own curve is described in words (§3).

**Motion.** Short and purposeful: hover ~150ms, entrance ~350ms, theme ~250ms. `Motion` is used only
where CSS genuinely cannot do the job. Nothing animates perpetually. Nothing parallaxes, pins, or
jacks the scroll. `prefers-reduced-motion` removes movement but keeps colour-only interaction
feedback.

## 6. Prohibitions

No empty sections. No placeholder or invented data. No "coming soon". No fake metrics. No box
shadows outside the one popover surface (a menu must detach from the page under it). No gradients
except the hero's own fill (§3) and Figure 404's cell ramp. No thumbnails or project detail pages. No hamburger
menu. No perpetual animation. No page-level fade on route change. No dashboard grammar.

## 7. Acceptance tests

Tests 1, 9, 10, and 11 are enforced by `bun test` and `bun run build`; the rest are manual checks run
against a preview deploy. A test with no runner is a promise, not a gate — the split is written down
here so nobody reads this list as green.

**Automated.**

1. `curl` of `/` contains the real token record behind Fig. 1; console shows no hydration mismatch.
**Manual.**

2. At 1440×900 the masthead — Fig. 1 plate, portrait, name and role — is visible without scrolling.
3. Zero horizontal scroll at 390, 768, 1024, 1280, 1440, 2560.
4. Every interactive target ≥24×24 at 390, with no exceptions claimed.
5. Both themes pass their stated contrast ratios.
6. Two screenshots taken 5s apart are pixel-identical once the hero has settled — the role line
    runs a single pass through `flipSentences` and rests on the canonical one, so the masthead is
    still from roughly ten seconds after load onward. Nothing on the page loops.
7. No section renders with zero real items — including Blog, which stays hidden at zero Posts.
8. Lighthouse: performance ≥95, accessibility 100, best practices 100, SEO 100. CLS = 0.
**Automated.**

9. `/writings` and `/writings/:slug` still permanent-redirect to `/blog` and
    `/blog/:slug` (Next emits 308, which preserves the method); `/feed.xml`
    still validates.
10. Every term in a Post's `## Definitions` section is marked at its first use
    in the body, and every mark resolves to a term — one `slugify`, in
    `lib/slug.ts`, on both sides. The build fails otherwise, so a definition
    can never be written and then dropped.
11. `/blog/[slug]/raw.md` serves `text/markdown` and contains no frontmatter.
