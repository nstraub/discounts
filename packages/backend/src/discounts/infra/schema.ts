import { boolean, pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const app = pgSchema('app');

export const greetings = app.table('greetings', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
});

export const discounts = app.table('discounts', {
  id: text('id').primaryKey(),
  item: text('item').notNull(),
  rate: text('rate').notNull(),
  storeName: text('store_name').notNull(),
  storeAddress: text('store_address').notNull(),
  hook: text('hook'),
});

export const coupons = app.table('coupons', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  discountId: text('discount_id')
    .notNull()
    .references(() => discounts.id),
  redeemed: boolean('redeemed').notNull().default(false),
});
