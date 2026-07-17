# Dhruv Sharma — Portfolio

Check it out: https://dhruv2mars.com

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Next.js dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | Next route typegen + TypeScript (`tsc --noEmit`) |
| `bun run test` | Vitest (jsdom) |

Use `bun run test`, not bare `bun test`. Bun’s built-in runner does not load the Vitest/jsdom setup this repo expects for component tests.


## Writing

Long-form pieces live as MDX under `content/writing/` with frontmatter
(`title`, `publishedAt`, `summary`; optional `image`, `draft: true`).
The collection drives `/writing`, `/writing/[slug]`, `/rss`, sitemap,
robots, JSON-LD, and `/og`. An empty collection shows a calm coming-soon
state — no fake posts.
