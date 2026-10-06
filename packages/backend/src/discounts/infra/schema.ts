import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

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
