-- Lossy: dropping the column loses every hook published, and nothing brings them back.
ALTER TABLE "app"."discounts" DROP COLUMN "hook";
