# Design contract

Read before touching code. Supersedes the retired LEDGER contract (see `docs/adr/0005`).

## 0. Relationship to the Reference

dai.is-a.dev is the bar. We build in its idiom on purpose. Two rules govern what transfers:

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

Next.js (App Router) · React · TypeScript · Tailwind v4 · shadcn/ui on Radix + Base UI primitives ·
Motion for animation · `next-themes` · MDX via `next-mdx-remote` · Vercel. Latest stable at build
time. `bun` for everything.

## 2. Surfaces

```
/                 Masthead → AI Activity → Projects → footer      (single dense scroll)
/blog             hidden until the first real Post exists
/blog/[slug]      Post
/feed.xml         RSS                    ← survives from the old build
/writings         301 → /blog            ← survives from the old build
/og               dynamic OG images
/sitemap.xml /robots.txt
404
```

`rehype-sanitize` on all MDX and escaped JSON-LD embedding survive from the old build unchanged.
Regressing either is a security bug, not a style change.

## 3. Masthead

One block, no hero. Avatar slot · name · `agentic engineer` · one line of positioning · social links
(x · github · linkedin · email).

**The avatar slot is a designed absence.** No portrait exists yet. Reserve the exact final footprint
and render a bordered placeholder that carries the same cursor-tracking light interaction a real
photo would. Empty shape, live behaviour. Dropping in a portrait later must be a one-line change with
zero layout shift. It must never read as a broken image.

## 4. AI Activity

The density anchor and the largest element above the fold. A year grid of day cells, intensity by
token count, with a hover/focus readout carrying the exact value — the readout is a fixed line, not a
floating tooltip, so nothing reflows. Lifetime total set large.

- Server-rendered with the real total present in the HTML before hydration. No skeleton, no
  client-only fetch, no hydration mismatch.
- One SVG, not hundreds of nodes. Grid semantics with a per-cell accessible name.
- Full keyboard traversal; the readout is an `aria-live` region.
- Below the tablet breakpoint the grid re-orients to a month matrix rather than scrolling
  horizontally. Every cell has a ≥24×24 hit area.
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

Rows, not cards — name, one line, language, year, outbound link. Hover reveals the destination host.
No thumbnails, no detail pages, no tag chips.

`pi-queue` shows **"published on npm"** as a fact and never a download counter — the real number is
too small to help. Revisit if relunar gains traction.

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
shadows. No gradients except the heatmap ramp. No thumbnails or project detail pages. No hamburger
menu. No perpetual animation. No page-level fade on route change. No dashboard grammar.

## 8. Acceptance tests

1. `curl` of `/` contains the real lifetime token total; console shows no hydration mismatch.
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
