import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const studentsTable = pgTable('students', {
  id: uuid().primaryKey(),
  name: varchar().notNull(),
});
