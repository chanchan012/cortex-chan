import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextProxy } from "next/server";
import { readConfig } from "./server/config";
const settings = readConfig();
const proxy: NextProxy = settings.clerkSecretKey ? clerkMiddleware() : () => NextResponse.next();
export default proxy;
// Hono verifies its own requests.
export const config = { matcher: ["/", "/sign-in/:path*", "/sign-up/:path*"] };
