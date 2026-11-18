import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL before using persistent storage");
  return drizzle(neon(url), { schema });
}
