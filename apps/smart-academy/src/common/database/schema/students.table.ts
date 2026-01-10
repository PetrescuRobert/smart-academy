import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const studentsTable = pgTable('students', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  email: varchar().notNull().unique(),
  profilePicture: varchar(),
});

export type StudentsTable = typeof studentsTable;

export type StudentModel = typeof studentsTable.$inferSelect;
