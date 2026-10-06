-- Lossy: dropping the column loses every count, so the sales counted before count again.
ALTER TABLE "app"."coupons" DROP COLUMN "counted";
