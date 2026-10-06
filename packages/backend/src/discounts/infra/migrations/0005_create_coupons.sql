CREATE TABLE "app"."coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"discount_id" text NOT NULL,
	CONSTRAINT "coupons_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "app"."coupons" ADD CONSTRAINT "coupons_discount_id_discounts_id_fk" FOREIGN KEY ("discount_id") REFERENCES "app"."discounts"("id") ON DELETE no action ON UPDATE no action;