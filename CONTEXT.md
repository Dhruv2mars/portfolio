# Portfolio

Dhruv Sharma's personal site (dhruv2mars.com): a proof surface for engineers, recruiters, and hiring
managers evaluating whether he is exceptional at his job.

## Language

**Portfolio**:
The site as a whole. Its job is to make a Visitor believe the work is real and the craft is high.
_Avoid_: Product site, marketing site, blog, side-project dump

**Visitor**:
An engineer, recruiter, or hiring engineer evaluating credibility. Assumed to be skimming, on a
laptop, in under sixty seconds.
_Avoid_: User, customer, reader (unless specifically reading a Post)

**Agentic Engineer**:
The positioning, and the site's tagline. Someone who builds tooling *for* coding agents and builds
*with* them as the default way of working — harnesses, extensions, local-first inference plumbing.
Proven by the Projects and by the token record drawn on Home, never asserted in a slogan.
_Avoid_: AI enthusiast, prompt engineer, ML researcher, "uses AI to code"

**Proof**:
Something real, third-party-verifiable, and linkable — a shipped repo, a published package, a live
demo, a dataset. The organising rule of the whole site: a section exists only when Proof fills it.
_Avoid_: Aspiration, roadmap, "coming soon", placeholder content, invented metrics

**Home**:
The densest surface, and the one that has to work in sixty seconds. A single scroll: Masthead →
Overview → Projects → Blog → footer, with the last two showing a sample and a door to the full
index. `/projects` and `/blog` hold the whole of what Home samples; nothing else has a
sub-route.
_Avoid_: Landing page, multi-page site, hub, dashboard

**Masthead**:
The top block — the hero figure, avatar slot, name (with a button that says it out loud), and the
tagline said more than one way. The figure is the AI Activity read model drawn faint and far back
behind the block, like a range at a distance; the block reads first and the figure is what it stands
on. The avatar slot is reserved and deliberately unfilled until a real portrait exists; it is a
designed absence, not a missing asset. The social links and the where/when of the author sit
below it in the Overview, not in the Masthead itself.
_Avoid_: Hero, banner, About section, long bio

**AI Activity**:
Dhruv's daily AI token usage, and the site's density anchor. Real data, synced nightly; a fixture
fallback is labelled as such. It is a dataset, not a section: it is drawn as the Masthead's hero
figure — this calendar year to date, one smoothed line — rather than as a year of squares of its own
(ADR-0007). It is the one dataset here that the Reference does not have.
_Avoid_: Analytics, dashboard, stats section, observability

**Project**:
One shipped piece of work, linking out to its repo or live demo. Curated, not enumerated — the
GitHub account has ~45 repos and the Portfolio shows eight. Presence on the site is an editorial
judgment about Proof, not a mirror of the account.
_Avoid_: Case study, work item, portfolio piece, repo list

**Blog / Post**:
The writing surface. `/blog` and `/blog/[slug]`, MDX, with RSS at `/feed.xml` and each Post also
served as source at `/blog/[slug]/raw.md`. The index is rows and a filter; a Post carries a toolbar
(copy, hand to a model, share, the Post either side), a glossary mark beside each defined term at
its first use, and its neighbours at the end. The Blog section, its nav entry and the route itself stay hidden while zero Posts are
published — nothing empty is ever shown to a Visitor.
_Avoid_: Articles, Journal, Newsletter, empty states, test posts presented as writing

**Reference**:
chanhdai.com (`ncdai/chanhdai.com`, formerly dai.is-a.dev) — the design idiom the Portfolio is built in, chosen deliberately as the bar to be
measured against. Its *design language* is adopted; its *information architecture* is not, because
it is sized to proof this site does not have.
_Avoid_: Inspiration, clone, template, "based on"
