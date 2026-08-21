# Release process

Portfolio ships preview-first.

- `main` is the review branch. Every push creates a Preview Deployment.
- `preview.dhruv2mars.com` follows the latest `main` Preview Deployment.
- `release` is the Vercel Production Branch. Keep it protected and do not push to it during normal work.
- `dhruv2mars.com` is GA. It changes only when a confirmed Preview Deployment is promoted.

## One-time Vercel setup

1. Create a `release` branch from the current GA commit if it does not exist.
2. Open [Vercel project settings](https://vercel.com/dhruv2mars/dhruv2mars/settings/environments). Go to Environments → Production → Branch Tracking. Set the Production Branch to `release`.
3. Open [Vercel domain settings](https://vercel.com/dhruv2mars/dhruv2mars/settings/domains). Add `preview.dhruv2mars.com`, then edit it and connect it to the Preview environment with Git Branch `main`.
4. At the DNS provider for `dhruv2mars.com`, add the exact record Vercel shows for `preview`. Current Vercel inspection requests `A preview.dhruv2mars.com 76.76.21.21`; use the project value if it changes.
5. Leave `dhruv2mars.com` and `www.dhruv2mars.com` connected to Production.

The branch setting matters. Vercel rejects a Preview domain that tracks the current Production Branch, so `main` must stop being Production before the custom Preview domain can track it.

## Each release

1. Open a PR. Use its unique Vercel Preview URL for change review.
2. Merge the approved PR into `main`. Vercel deploys `main` as Preview and updates `https://preview.dhruv2mars.com`.
3. Check the stable Preview URL, then promote that exact deployment only after sign-off:

   ```bash
   vercel promote <deployment-url>
   ```

   The same action is available from the deployment menu in Vercel as **Promote to Production**.

4. Confirm GA at `https://dhruv2mars.com`. Do not use `vercel --prod` for an unconfirmed build.

## Checks

```bash
dig +short preview.dhruv2mars.com
curl -I https://preview.dhruv2mars.com
curl -I https://dhruv2mars.com
```

The first command should resolve to Vercel. Both HTTP requests should return `200` or the site's expected redirect response.
