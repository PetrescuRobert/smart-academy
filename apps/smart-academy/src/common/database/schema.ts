import { studentsTable } from './schema/students.table';
import { coursesTable } from './schema/courses.table';

export const schema = {
  coursesTable,
  studentsTable,
};

export type Schema = typeof schema;
