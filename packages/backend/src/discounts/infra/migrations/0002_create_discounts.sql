CREATE TABLE "app"."discounts" (
	"id" text PRIMARY KEY NOT NULL,
	"item" text NOT NULL,
	"rate" double precision NOT NULL,
	"store_name" text NOT NULL,
	"store_address" text NOT NULL
);
