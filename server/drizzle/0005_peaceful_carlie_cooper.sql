ALTER TABLE "seats" DROP CONSTRAINT "seats_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "user_id";