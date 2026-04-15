ALTER TABLE "movies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "movies" CASCADE;--> statement-breakpoint
ALTER TABLE "seats" DROP CONSTRAINT "seats_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "seats" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(128);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "slot";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "movie_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "salt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_expires";--> statement-breakpoint
DROP TYPE "public"."showtime";