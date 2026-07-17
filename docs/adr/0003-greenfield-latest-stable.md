# Greenfield replace on latest stable stack

The redesign replaces the existing thin Next 14 portfolio in-repo rather than restyling it. Same GitHub repo, Vercel project, and domain. The implementation uses current latest stable versions of the chosen stack (Next.js, React, Tailwind, TypeScript, etc.) at the time of build — not pinned to the old 14.x baseline — and takes Vercel portfolio-blog starter capabilities as the feature baseline (see ADR-0002), not as a frozen dependency set.
