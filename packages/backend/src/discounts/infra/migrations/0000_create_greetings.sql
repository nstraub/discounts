CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."greetings" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
