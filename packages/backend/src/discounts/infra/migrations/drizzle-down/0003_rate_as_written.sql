-- Rows whose rate is not a number cannot go back: the cast refuses them and the whole down fails.
ALTER TABLE "app"."discounts" ALTER COLUMN "rate" SET DATA TYPE double precision USING "rate"::double precision;
