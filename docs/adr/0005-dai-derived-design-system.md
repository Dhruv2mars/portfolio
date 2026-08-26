# Retire the LEDGER contract; rebuild in the chanhdai.com idiom

The previous design contract (`DESIGN.md`, "LEDGER — One Year Wide") explicitly required the site to
be visually distinguishable from dai.is-a.dev (`§FIX-12`, acceptance test 14). That constraint is
withdrawn. The site is rebuilt in the design idiom of dai.is-a.dev — dark-first, Geist, dense
single-page home, quiet chrome, high type and spacing discipline — because it is the strongest
reference point available for a design-engineer portfolio and the goal is to be measured against it,
not to differ from it for its own sake.

## Considered options

- **Fork chanhdai.com directly** (MIT, fork explicitly permitted; name and logo are trademarked and
  would be swapped). Rejected: inherits an information architecture built around a 36-component
  registry, a sponsors programme, awards and testimonials — sections we have no content for. Empty
  shelves read worse than no shelves.
- **Keep LEDGER, graft in only the measurement discipline.** Rejected: the visual outcome would not
  resemble the reference at all, which is the stated goal.
- **Rebuild in the idiom with an information architecture sized to real proof.** Chosen.

## Consequences

- `DESIGN.md` and `CONTEXT.md` are both rewritten. The old glossary rules that now conflict —
  "primary nav is exactly three items", "no cards", "text-only project list" — do not carry over.
- Every home section must be backed by real content. A section with nothing real to show is not
  built, rather than built and left thin.
- Three things survive the rebuild for reasons unrelated to design and must not be re-derived:
  the `/writings → /blog` 301, the feed/sitemap/robots routes, and the `rehype-sanitize` MDX
  hardening from the earlier security work.
- ~~The AI Activity heatmap is kept and redesigned. It occupies the slot the reference gives its
  GitHub contribution graph, and is the one dense dataset this site has that the reference does
  not.~~ **Superseded by ADR-0007**: the grid is removed and the same read model is drawn as the
  hero figure. The dataset stays; the shape does not.
