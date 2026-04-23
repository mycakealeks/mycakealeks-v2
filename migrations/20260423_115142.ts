import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_coupons_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_points_type" AS ENUM('earned', 'spent');
  CREATE TYPE "public"."enum_points_reason" AS ENUM('course_purchase', 'recipe_purchase', 'referral', 'promotion', 'bonus', 'spend');
  CREATE TYPE "public"."enum_achievements_type" AS ENUM('first_lesson', 'first_course', 'streak_7days', 'streak_30days', 'vip_student', 'all_courses');
  CREATE TABLE "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"type" "enum_coupons_type" DEFAULT 'percentage' NOT NULL,
  	"value" numeric NOT NULL,
  	"min_order_amount" numeric DEFAULT 0,
  	"max_uses" numeric DEFAULT 0,
  	"used_count" numeric DEFAULT 0,
  	"expires_at" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "points" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"points" numeric NOT NULL,
  	"type" "enum_points_type" NOT NULL,
  	"reason" "enum_points_reason" NOT NULL,
  	"order_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "achievements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_achievements_type" NOT NULL,
  	"earned_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "coupons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "points_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "achievements_id" integer;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "points" ADD CONSTRAINT "points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE INDEX "coupons_rels_order_idx" ON "coupons_rels" USING btree ("order");
  CREATE INDEX "coupons_rels_parent_idx" ON "coupons_rels" USING btree ("parent_id");
  CREATE INDEX "coupons_rels_path_idx" ON "coupons_rels" USING btree ("path");
  CREATE INDEX "coupons_rels_courses_id_idx" ON "coupons_rels" USING btree ("courses_id");
  CREATE INDEX "points_user_idx" ON "points" USING btree ("user_id");
  CREATE INDEX "points_updated_at_idx" ON "points" USING btree ("updated_at");
  CREATE INDEX "points_created_at_idx" ON "points" USING btree ("created_at");
  CREATE INDEX "achievements_user_idx" ON "achievements" USING btree ("user_id");
  CREATE INDEX "achievements_type_idx" ON "achievements" USING btree ("type");
  CREATE INDEX "achievements_updated_at_idx" ON "achievements" USING btree ("updated_at");
  CREATE INDEX "achievements_created_at_idx" ON "achievements" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_points_fk" FOREIGN KEY ("points_id") REFERENCES "public"."points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_achievements_fk" FOREIGN KEY ("achievements_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");
  CREATE INDEX "payload_locked_documents_rels_points_id_idx" ON "payload_locked_documents_rels" USING btree ("points_id");
  CREATE INDEX "payload_locked_documents_rels_achievements_id_idx" ON "payload_locked_documents_rels" USING btree ("achievements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "coupons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "achievements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "coupons_rels" CASCADE;
  DROP TABLE "points" CASCADE;
  DROP TABLE "achievements" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_coupons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_points_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_achievements_fk";
  
  DROP INDEX "payload_locked_documents_rels_coupons_id_idx";
  DROP INDEX "payload_locked_documents_rels_points_id_idx";
  DROP INDEX "payload_locked_documents_rels_achievements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "coupons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "points_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "achievements_id";
  DROP TYPE "public"."enum_coupons_type";
  DROP TYPE "public"."enum_points_type";
  DROP TYPE "public"."enum_points_reason";
  DROP TYPE "public"."enum_achievements_type";`)
}
