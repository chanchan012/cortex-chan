CREATE TABLE "diagrams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"topology" jsonb DEFAULT '{"version":1,"nodes":[],"edges":[]}'::jsonb NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diagrams_name_length" CHECK (length(trim("diagrams"."name")) between 1 and 120),
	CONSTRAINT "diagrams_revision_nonnegative" CHECK ("diagrams"."revision" >= 0)
);
--> statement-breakpoint
CREATE INDEX "diagrams_owner_updated_idx" ON "diagrams" USING btree ("owner_id","updated_at");