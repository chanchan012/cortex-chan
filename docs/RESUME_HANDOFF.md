# Resume Cortex after Subgoal 1.1

Start from GitHub `chanchan012/cortex-chan`, branch `main`. The 1.1 implementation is `f2a0215`, merged at `225d80e`. Vercel project `cortex-chan` is linked to the repository and deploys main to production. Consult PROGRESS.md for the verified deployments.

## Reproduce the guest release

1. Use Node 24.x and run `npm ci` in the repository.
2. Run `npm run dev` and open `http://localhost:3000`. Follow Explore guest demo, select the API service, change the traffic profile and pause the packets.
3. Run `npm test` and `npm run typecheck`. Install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. Playwright starts its own server on 127.0.0.1:3187 and sets empty Clerk/Upstash keys.
4. Run `npm run build`, then `npm start` to serve the optimized output. On restricted Windows runners, Next.js/PostCSS workers and Playwright need local process and loopback connectivity. If an interrupted build leaves a failing worker cache, stop the test server and move the generated .next directory aside before retrying.

## Enable the services

Copy `.env.example` to `.env.local` for development. In Vercel, set values separately for Preview and Production, then redeploy. Each Clerk or Upstash pair must come from the same instance. Use development services for local/preview checks.

| Variable | Value source and use |
| --- | --- |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk API Keys, browser publishable key |
| CLERK_SECRET_KEY | Clerk API Keys, server secret for Next and Hono |
| DATABASE_URL | Neon PostgreSQL connection string with SSL |
| UPSTASH_REDIS_REST_URL | Upstash Redis REST endpoint, HTTPS |
| UPSTASH_REDIS_REST_TOKEN | Upstash Redis read/write REST token, server only |

Configure the production domain in Clerk. Sign in and check that /api/session reports member and /api/account returns the same user ID. The production release used no provider secrets. Verify tenant-specific flows after configuration.

Set DATABASE_URL for the intended Neon branch and run `npm run db:migrate` once against that branch before CRUD work. This release generated the migration locally. No remote database has been migrated. With Upstash configured, exercise a test bucket through /api/session until it returns 429 and check the Retry-After header. Without Redis the limiter is shared in memory per process.

## Next subgoal

Start 1.2 on a feature branch from current main. Brief the responsive landing/dashboard work, authenticated owner-scoped diagram CRUD and Inngest thumbnail generation. Use the existing diagrams table, assign owner_id from verified auth, validate names and topology at the API boundary, and keep guests read-only until the guest storage design is defined. Add Vitest coverage for CRUD and thumbnail jobs and Playwright grid and viewport checks. Continue through test, merge, deployment and updates to all three handoff files.
