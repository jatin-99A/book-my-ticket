CREATE TYPE "public"."showtime" AS ENUM('11:00 AM', '3:00 PM', '7:00 PM', '10:30 PM');--> statement-breakpoint
CREATE TYPE "public"."slot" AS ENUM('11:00 AM', '3:00 PM', '7:00 PM', '10:30 PM');--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"genre" varchar(100) NOT NULL,
	"duration" integer NOT NULL,
	"rating" numeric(2, 1),
	"price" integer NOT NULL,
	"release_date" text NOT NULL,
	"description" text,
	"poster" text,
	"showtime" "showtime" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"isbooked" integer DEFAULT 0,
	"slot" "slot" NOT NULL,
	"movie_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;