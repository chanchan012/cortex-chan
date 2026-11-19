# Cortex progress

## Subgoal 1.1 — released 2026-11-18

| Phase | Verified outcome |
| --- | --- |
| Brief | Foundation, viewport shell, provider adapters, guest/auth RPC and release handoff |
| Build | Next 16.4.6, React 19.3.1, strict TypeScript, Tailwind 4, Hono, Clerk, Neon/Drizzle and Upstash. Guest demo works with empty environment variables. |
| Test | 13 Vitest tests and 30 Chromium Playwright tests passed. Strict type checking passed. Tested 1440×900, 768×1024, 390×844, 320×568 and 844×390 viewports. |
| Merge | Tested feature commit `f2a0215` merged into main as `225d80e`. Both branches published to GitHub. |
| Deploy | Local optimized Next build passed. Vercel reported READY for the production merge and the feature preview. |
| Document | Schema, RPC contracts, provider behavior, test boundaries and next-subgoal setup recorded in docs. |

- [Production](https://cortex-chan.vercel.app) · implementation deployment `dpl_ALRcVUJHR2RmrVzmJSZqQe94KWKi`
- [Feature preview](https://cortex-chan-qr40cx09z-chanchans-projects-aada625f.vercel.app) · deployment `dpl_8hqFhkDSL7A5G1BafoW49Pk15E2D`
- [GitHub](https://github.com/chanchan012/cortex-chan)

The guest demo's readings are illustrative.

### Provider setup — 2026-11-19

- Neon project `still-bird-86777802`, branch `production`, contains the new `cortex` database. Applied `0000_nifty_prism` in a transaction and verified `public.diagrams` and one entry in `drizzle.__drizzle_migrations`. Production Vercel has `DATABASE_URL`.
- Created a dedicated Clerk application named Cortex. Vercel Preview uses its development keys. Verified the preview sign-in route and an anonymous Hono session response. Full signed-in session verification is pending. Clerk production setup needs a verified custom domain.
- The existing free Upstash database still needs to be connected. The Vercel connector listed the installation but did not expose a database attach action, and browser control could not open the signed-in Upstash tab. The app uses the process-local limiter.

At release, `npm audit --omit=dev` returned no production advisories. The full audit reported nine development-tool findings (four moderate, five high) in the Drizzle Kit/esbuild and Vitest/picomatch dependency chains. Recheck when upgrading the lockfile.

**Next:** Subgoal 1.2, dashboard CRUD and Inngest thumbnails. Subgoals 1.2–4.2 are pending.
