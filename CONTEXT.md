# Portfolio

Dhruv Sharma’s personal site (dhruv2mars.com): a brand and proof surface for engineers, recruiters, and hiring managers.

## Language

**Portfolio**:
The site as a whole — a personal brand / proof surface whose job is to make a visitor believe Dhruv is exceptional at his job.
_Avoid_: Product site, marketing site, blog-only, side project dump

**Visitor**:
An engineer, recruiter, or hiring engineer evaluating Dhruv’s credibility.
_Avoid_: User, customer, reader (unless specifically reading a Post)

**AI-pilled**:
Default identity as “the AI person” — builds and thinks with AI/agents as the primary way of working, not as a side interest.
_Avoid_: AI-curious, uses ChatGPT, ML researcher (unless a Post is specifically about that)

**Design Engineer**:
Someone who ships interface craft at a high bar — design and frontend are the same job, not separate handoffs. The Portfolio itself is evidence of this.
_Avoid_: Frontend developer, UI designer, “I also do design”

**Product thinking**:
Clear judgment about what to build, why, and where it fits — shown primarily through writing, not slogans.
_Avoid_: Product manager, strategist, “visionary”

**Editorial surface**:
The Portfolio’s visual and UX north star — warm monochrome editorial craft in the lineage of pablostanley.com / loganliffick.com / evilrabbit.com: warm-tinted neutrals (never cool gray), hairline-divided CV rows (name → one-line description → url ↗ → year/date), 12px uppercase micro-labels with wide tracking, Geist type and spacing doing the work. No chromatic accent in chrome; blue survives only inside the AI Activity heatmap. Flat background — no gradients, no noise. Light is the primary theme; a polished warm dark theme is also available. Motion stays quiet and intentional (theme transition, hovers, heatmap tooltip, staggered fade-rise entrances) — craft through restraint, not spectacle. Signature details: inverted-ink text selection and a live local-time readout in the footer.
_Avoid_: Dashboard-first, marketing-campaign, “SaaS admin UI”, dark-only, scroll-jacking, particle heroes, atmospheric gradients/noise, colored accents outside the heatmap

**AI Activity**:
A GitHub-contribution-style heatmap of Dhruv’s AI usage on Home under the profile/intro. Year grid of day cells (intensity by tokens), hover tooltip (date + tokens), quiet legend, plus a single lifetime-tokens summary. Fixture data until ingestion exists. Reference image was conceptual only — no Daily/Weekly/Cumulative tabs or streak/analytics chrome in v1.
_Avoid_: Analytics dashboard, Observability, “stats section”, copying a specific product’s chrome

**Home**:
The landing surface. One centered 42rem column for everything — header, sections, footer. Section order: profile/intro → AI Activity → selected Projects → latest Writings (only if at least one Post is published) → footer. Primary nav destination. The intro is a short rewritten editorial block (name + brief positioning + pulsing status line + mono socials row) — not the old bio, and not omitted. Sections separate by whitespace (~64px) only; hairlines belong to lists, not section boundaries. Footer is minimal (name/©, live local time, mono socials + RSS); no mega-footer.
_Avoid_: Landing page, dashboard, feed, slogan stacks, long About essay on Home, empty Writings teaser on Home, section divider lines, sticky/blurred header chrome

**Writings**:
The writing index and articles — where Product thinking is proven. Nav label and routes are **Writings**: `/writings` and `/writings/[slug]`. RSS at `/feed.xml` (head/footer discovery, not primary nav). At first ship there may be zero published Posts — the surface still exists with a quiet empty/coming-soon state; MDX pipeline, RSS, and SEO stay wired for when Posts land.
_Avoid_: Blog, Articles, Journal, Newsletter, `/blog` as the public path, fake sample essays presented as real

**Post**:
One piece of writing under Writings. MDX body with frontmatter: title, published date, summary, optional tags; slug from the file path. Drafts exist but never ship publicly. Reading time may be derived; no view counters, reactions, or multi-author in v1.
_Avoid_: Article, essay, blog post (in UI copy prefer Post/Writings)

**Projects**:
The project index — shipped work as proof. Presented as an editorial, text-only list; links outbound to repo or demo. Each Project has name, one-line description, url, optional year, and optional selected flag for Home. No thumbnails, cards, tag chips, or project detail pages in v1.
_Avoid_: Work, Portfolio items, Case studies (unless a specific Post is a case study), template marketplace grid

**Primary nav**:
Exactly three items: Home, Writings, Projects. RSS exists as a feed URL, not a nav item. Header also includes a quiet theme control (Vercel-like) that follows system preference by default and persists a manual override. The header is non-sticky and un-chromed: no border, no blur, same 42rem column as content.
_Avoid_: About, Contact, Activity, Uses as top-level nav (unless later promoted deliberately), sticky/backdrop-blur nav chrome
