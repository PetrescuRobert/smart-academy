import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const studentsTable = pgTable('students', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  name: varchar().notNull(),
});
