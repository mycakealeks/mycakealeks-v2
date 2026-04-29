import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "user_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"session_id" varchar,
  	"event" varchar NOT NULL,
  	"entity_id" varchar,
  	"entity_type" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "user_events_user_idx" ON "user_events" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "user_events_event_idx" ON "user_events" USING btree ("event");
  CREATE INDEX IF NOT EXISTS "user_events_updated_at_idx" ON "user_events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "user_events_created_at_idx" ON "user_events" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "user_events" CASCADE;`)
}
