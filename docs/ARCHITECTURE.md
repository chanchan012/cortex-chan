# Cortex foundation architecture

## Browser and routing

Next.js 16 App Router renders the React 19 shell. The layout mounts ClerkProvider when both Clerk keys are present. The page proxy invokes Clerk middleware on the landing and authentication pages. Authentication pages support Clerk's nested verification routes. A signed-in header renders the Clerk user menu. Guest mode requires no provider credentials.

| Path | Behavior |
| --- | --- |
| `/` | Landing page with an interactive SVG topology using illustrative readings |
| `/?demo=1` | Guest inspection, steady/spike sample profiles and packet animation controls |
| `/sign-in/[[...sign-in]]` | Clerk sign-in or guest entry |
| `/sign-up/[[...sign-up]]` | Clerk sign-up or guest entry |

Page shells allocate exactly `100dvh` to the header, main and footer. Main panels can scroll internally when content needs more room. SVG packet animation honors reduced motion. The sample topology is component-local and resets on navigation. Calculated metrics and persistent changes start in later milestones.

## API boundary

The App Router catch-all delegates GET to Hono via `hono/vercel`. The chained router exposes `AppType` for typed `hc` clients. In configured mode, `@hono/clerk-auth` authenticates the request and supplies the user ID. Guest mode sets it to null. No identity is accepted directly from a caller-supplied user header. Responses use `Cache-Control: private, no-store`.

| GET endpoint | Success JSON | Other responses |
| --- | --- | --- |
| `/api/health` | `{"service":"cortex","status":"ok"}` | App liveness only |
| `/api/session` | `{"mode":"guest"}` or `{"mode":"member","userId":"…"}` | Available in either mode |
| `/api/account` | `{"userId":"…"}` | 401 with `{"error":"sign_in_required"}` for guests |

All three routes share the limiter. Upstash enforces 60 requests per minute using its sliding-window algorithm. Authenticated requests key on user ID. Guests on Vercel key on the platform-supplied forwarded IP, with a shared bucket when absent. Without Upstash, one bounded in-process window covers all requests on that instance. It resets on cold starts. A denied request returns 429, `rate_limited` and a `Retry-After` header. Redis errors and timeouts return 503 with `quota_unavailable`. Supplying just one key of either provider pair fails configuration validation.

## Persistent schema

Drizzle's lazy Neon HTTP client is in `src/db/client.ts`. The SQL migration and Drizzle metadata are checked in under `drizzle/`. The foundation exposes no diagram mutations.

| diagrams column | PostgreSQL type | Contract |
| --- | --- | --- |
| id | uuid | Primary key, generated with gen_random_uuid() |
| owner_id | text | Required Clerk user ID |
| name | text | Required, trimmed length from 1 to 120 |
| topology | jsonb | Required, default `{"version":1,"nodes":[],"edges":[]}` |
| revision | integer | Required, nonnegative, default 0 |
| created_at | timestamptz | Required, default now() |
| updated_at | timestamptz | Required, default now() |

The owner/update-time index supports dashboard listing. The future update path must set updated_at and increment revision explicitly. Ownership filtering and topology payload validation belong on the server when CRUD is introduced. See `src/db/schema.ts` and `drizzle/0000_nifty_prism.sql` for the precise definitions.

## Verification boundary

Vitest exercises typed Hono RPC, guest handling, configured Clerk middleware without a session, an injected authenticated principal, quota boundaries and provider configuration errors. Playwright runs Chromium against a local Next.js server with empty provider keys. Live Clerk login, Neon migration and cross-instance Redis quotas require configured test services. The dashboard, simulator, Inngest, SSE and MCP are scheduled for subsequent subgoals.
