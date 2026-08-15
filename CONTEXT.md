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
Proven by the Projects and the AI Activity, never asserted in a slogan.
_Avoid_: AI enthusiast, prompt engineer, ML researcher, "uses AI to code"

**Proof**:
Something real, third-party-verifiable, and linkable — a shipped repo, a published package, a live
demo, a dataset. The organising rule of the whole site: a section exists only when Proof fills it.
_Avoid_: Aspiration, roadmap, "coming soon", placeholder content, invented metrics

**Home**:
The only substantial surface. A single dense scroll: Masthead → AI Activity → Projects → footer.
Everything the Visitor needs is on it; sub-routes exist for Blog only.
_Avoid_: Landing page, multi-page site, hub, dashboard

**Masthead**:
The top block — avatar slot, name, the tagline, one short line of positioning, social links. The
avatar slot is reserved and deliberately unfilled until a real portrait exists; it is a designed
absence, not a missing asset.
_Avoid_: Hero, banner, About section, long bio

**AI Activity**:
The year grid of Dhruv's AI token usage, and the site's density anchor. Real data, synced; a fixture
fallback is labelled as such. It occupies the slot a conventional portfolio gives a GitHub
contribution graph, and it is the one dataset here that the Reference does not have.
_Avoid_: Analytics, dashboard, stats section, observability

**Project**:
One shipped piece of work, linking out to its repo or live demo. Curated, not enumerated — the
GitHub account has ~45 repos and the Portfolio shows eight. Presence on the site is an editorial
judgment about Proof, not a mirror of the account.
_Avoid_: Case study, work item, portfolio piece, repo list

**Blog / Post**:
The writing surface. `/blog` and `/blog/[slug]`, MDX, with RSS at `/feed.xml`. Zero Posts exist
today; the pipeline ships fully wired but the section and its nav entry stay hidden until a real
Post is published. Nothing empty is ever shown to a Visitor.
_Avoid_: Articles, Journal, Newsletter, empty states, test posts presented as writing

**Reference**:
dai.is-a.dev — the design idiom the Portfolio is built in, chosen deliberately as the bar to be
measured against. Its *design language* is adopted; its *information architecture* is not, because
it is sized to proof this site does not have.
_Avoid_: Inspiration, clone, template, "based on"
