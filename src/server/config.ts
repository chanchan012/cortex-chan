import { z } from "zod";

const config = z.object({
  clerkPublicKey: z.string().min(1).optional(),
  clerkSecretKey: z.string().min(1).optional(),
  redisUrl: z.url().startsWith("https://").optional(),
  redisToken: z.string().min(1).optional(),
}).superRefine((values, ctx) => {
  for (const [left, right] of [
    ["clerkPublicKey", "clerkSecretKey"], ["redisUrl", "redisToken"],
  ] as const) {
    if (Boolean(values[left]) !== Boolean(values[right])) {
      ctx.addIssue({ code: "custom", message: `Configure ${left} and ${right} together` });
    }
  }
});

export function readConfig(env: Record<string, string | undefined> = process.env) {
  const result = config.safeParse({
    clerkPublicKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || undefined,
    clerkSecretKey: env.CLERK_SECRET_KEY || undefined,
    redisUrl: env.UPSTASH_REDIS_REST_URL || undefined,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN || undefined,
  });
  if (!result.success) throw new Error("Invalid Cortex provider configuration. Check .env.example.");
  return result.data;
}
