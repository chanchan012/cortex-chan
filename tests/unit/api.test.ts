import { describe, expect, it, vi } from "vitest";
import { hc } from "hono/client";
import { createApi, type AppType } from "../../src/server/api";
import { createIdentity } from "../../src/server/identity";
import { readConfig } from "../../src/server/config";
import { createLimiter, localLimiter, quota } from "../../src/server/limiter";

const guest = createIdentity(readConfig({}));
const open = () => createApi(guest, createLimiter(readConfig({})));
describe("foundation RPC", () => {
  it("passes a cookie-free request through the configured Clerk middleware as a guest", async () => {
    const settings = readConfig({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_" + Buffer.from("foundation.clerk.accounts.dev$").toString("base64"),
      CLERK_SECRET_KEY: "sk_test_fixture",
    });
    const app = createApi(createIdentity(settings), localLimiter());
    const result = await app.request("https://example.test/api/session");
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({mode:"guest"});
  });
  it("serves a typed liveness response", async () => {
    const app = open();
    const client = hc<AppType>("http://localhost", {fetch: app.request.bind(app)});
    expect(await (await client.api.health.$get()).json()).toEqual({service:"cortex",status:"ok"});
  });
  it("keeps anonymous responses private and rejects fabricated identity headers", async () => {
    const app = open();
    const headers = {"x-user-id":"member", Authorization:"Bearer fake"};
    const session = await app.request("/api/session",{headers});
    expect(await session.json()).toEqual({mode:"guest"});
    expect(session.headers.get("cache-control")).toContain("no-store");
    expect((await app.request("/api/account",{headers})).status).toBe(401);
  });
  it("grants account access only to the verified user from middleware", async () => {
    const limit = vi.fn(localLimiter());
    const app = createApi(async (c,next) => {c.set("userId","user_123"); await next();},limit);
    expect(await (await app.request("/api/account")).json()).toEqual({userId:"user_123"});
    expect(await (await app.request("/api/session")).json()).toEqual({mode:"member",userId:"user_123"});
    expect(limit).toHaveBeenCalledWith("user:user_123");
  });
  it("returns retry metadata when the sliding window is full", async () => {
    const now = Date.now();
    const limit = localLimiter(() => now);
    const app = createApi(guest,limit);
    for (let i=0; i<quota; i++) expect((await app.request("/api/session")).status).toBe(200);
    const denied = await app.request("/api/session");
    expect(denied.status).toBe(429);
    expect(Number(denied.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(denied.headers.get("RateLimit-Remaining")).toBe("0");
  });
  it("expires quota entries exactly at the window boundary", async () => {
    let now=0;
    const limit=localLimiter(() => now);
    for (let i=0; i<quota; i++) await limit("guest");
    now=59_999;
    expect((await limit("guest")).success).toBe(false);
    now++;
    expect((await limit("guest")).remaining).toBe(quota-1);
  });
  it("fails closed when the quota store fails", async () => {
    const app=createApi(guest,async () => {throw new Error("upstream");});
    expect((await app.request("/api/account")).status).toBe(503);
  });
});
describe("provider settings", () => {
  it.each([
    {CLERK_SECRET_KEY:"secret"}, {NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:"public"},
    {UPSTASH_REDIS_REST_URL:"https://demo.invalid"}, {UPSTASH_REDIS_REST_TOKEN:"token"},
    {UPSTASH_REDIS_REST_URL:"http://demo.invalid",UPSTASH_REDIS_REST_TOKEN:"token"},
  ])("rejects incomplete or insecure provider pairs", (env) => {
    expect(() => readConfig(env)).toThrow("Invalid Cortex provider configuration");
  });
  it("accepts an empty guest environment", () => expect(readConfig({}).clerkSecretKey).toBeUndefined());
});
