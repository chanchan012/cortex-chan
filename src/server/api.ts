import { Hono, type MiddlewareHandler } from "hono";
import { quota, type Limit, type Quota } from "./limiter";

export type ApiEnv = { Variables: { userId: string | null } };
export function createApi(identity: MiddlewareHandler<ApiEnv>, limit: Limit) {
  return new Hono<ApiEnv>().basePath("/api")
    .use("*", async (c, next) => {
      c.header("Cache-Control", "private, no-store");
      await next();
    })
    .use("*", identity)
    .use("*", async (c, next) => {
      const ip = process.env.VERCEL === "1" ? c.req.header("x-vercel-forwarded-for") : undefined;
      const key = c.get("userId") ? `user:${c.get("userId")}` : `guest:${ip ?? "shared"}`;
      let result: Quota;
      try { result = await limit(key); } catch { return c.json({ error: "quota_unavailable" }, 503); }
      c.header("RateLimit-Limit", String(quota));
      c.header("RateLimit-Remaining", String(result.remaining));
      if (!result.success) {
        c.header("Retry-After", String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))));
        return c.json({ error: "rate_limited" }, 429);
      }
      await next();
    })
    .get("/health", (c) => c.json({ service: "cortex", status: "ok" } as const))
    .get("/session", (c) => {
      const userId = c.get("userId");
      return userId ? c.json({ mode: "member", userId } as const) : c.json({ mode: "guest" } as const);
    })
    .get("/account", (c) => {
      const userId = c.get("userId");
      return userId ? c.json({ userId }) : c.json({ error: "sign_in_required" }, 401);
    });
}
export type AppType = ReturnType<typeof createApi>;
