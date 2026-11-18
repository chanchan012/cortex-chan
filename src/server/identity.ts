import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import type { MiddlewareHandler } from "hono";
import type { ApiEnv } from "./api";
import type { readConfig } from "./config";

export function createIdentity(config: ReturnType<typeof readConfig>): MiddlewareHandler<ApiEnv> {
  if (!config.clerkSecretKey) return async (c, next) => { c.set("userId", null); await next(); };
  const verify = clerkMiddleware({ secretKey: config.clerkSecretKey, publishableKey: config.clerkPublicKey });
  return (c, next) => verify(c, async () => {
    c.set("userId", getAuth(c)?.userId ?? null);
    await next();
  });
}
