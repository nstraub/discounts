import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

const app = pgSchema('app');

export const greetings = app.table('greetings', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
});
