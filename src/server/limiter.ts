import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { readConfig } from "./config";

export type Quota = { success: boolean; remaining: number; reset: number };
export type Limit = (key: string) => Promise<Quota>;
export const quota = 60;
const minute = 60_000;

// Without Redis, guest preview requests share a bounded, process-local quota.
export function localLimiter(now = Date.now): Limit {
  let hits: number[] = [];
  return async () => {
    const time = now();
    hits = hits.filter((hit) => hit > time - minute);
    const success = hits.length < quota;
    if (success) hits.push(time);
    return { success, remaining: quota - hits.length, reset: hits[0] + minute };
  };
}

export function createLimiter(config: ReturnType<typeof readConfig>): Limit {
  if (!config.redisUrl || !config.redisToken) return localLimiter();
  const redis = new Redis({ url: config.redisUrl, token: config.redisToken });
  const limiter = new Ratelimit({ redis, prefix: "cortex:v1", limiter: Ratelimit.slidingWindow(quota, "1 m") });
  return async (key) => {
    const result = await limiter.limit(key);
    if (result.reason === "timeout") throw new Error("Rate limit store timed out");
    return result;
  };
}
