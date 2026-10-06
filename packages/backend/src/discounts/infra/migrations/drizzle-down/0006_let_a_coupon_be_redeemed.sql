-- Lossy: dropping the column loses every use of a coupon, so a coupon used before can be used again.
ALTER TABLE "app"."coupons" DROP COLUMN "redeemed";
