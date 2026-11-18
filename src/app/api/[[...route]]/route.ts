import { handle } from "hono/vercel";
import { createApi } from "@/server/api";
import { readConfig } from "@/server/config";
import { createIdentity } from "@/server/identity";
import { createLimiter } from "@/server/limiter";

const config = readConfig();
export const GET = handle(createApi(createIdentity(config), createLimiter(config)));
export const dynamic = "force-dynamic";
