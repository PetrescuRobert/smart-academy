import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const coursesTable = pgTable('courses', {
  id: uuid().primaryKey(),
  title: varchar().notNull(),
  description: varchar(),
  active: boolean().default(false),
});
