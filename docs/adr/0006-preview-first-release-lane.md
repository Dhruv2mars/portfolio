# Preview-first release lane

Status: accepted

## Context

The Vercel project currently treats `main` as Production. That makes a merge immediately visible on `dhruv2mars.com`, before owner review. PR previews already exist, but they are ephemeral URLs and do not provide one stable review address for the next release.

## Decision

Use Vercel's branch-tracked Preview domain for release review:

- `main` becomes a Preview branch.
- `preview.dhruv2mars.com` tracks the latest Preview Deployment from `main`.
- `release` becomes the Vercel Production Branch and stays protected.
- Owner approval promotes the exact reviewed Preview Deployment to Production.

Keep the canonical Vercel project `dhruv2mars`. Do not create a second project for staging.

## Consequences

Merges to `main` are safe to review at a stable URL. GA becomes an explicit promotion step, so production can remain on the last approved deployment. Preview and Production environment variables remain separate.
