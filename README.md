# Dhruv Sharma — Portfolio

Check it out: https://dhruv2mars.com

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Next.js dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript (`tsc --noEmit`) |
| `bun run test` | Vitest (jsdom) |

Use `bun run test`, not bare `bun test`. Bun’s built-in runner does not load the Vitest/jsdom setup this repo expects for component tests.
