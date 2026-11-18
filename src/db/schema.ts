import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const diagrams = pgTable("diagrams", {
  id: uuid().primaryKey().defaultRandom(),
  ownerId: text("owner_id").notNull(),
  name: text().notNull(),
  topology: jsonb().notNull().default({ version: 1, nodes: [], edges: [] }),
  revision: integer().notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("diagrams_owner_updated_idx").on(table.ownerId, table.updatedAt),
  check("diagrams_name_length", sql`length(trim(${table.name})) between 1 and 120`),
  check("diagrams_revision_nonnegative", sql`${table.revision} >= 0`),
]);
