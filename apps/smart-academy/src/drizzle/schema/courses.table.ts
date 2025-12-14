import { sql } from 'drizzle-orm';
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const coursesTable = pgTable('courses', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  title: varchar().notNull(),
  description: varchar(),
  active: boolean().default(false),
});
