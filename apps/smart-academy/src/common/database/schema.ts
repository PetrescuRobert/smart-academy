import { coursesTable } from '../../course/infrastructure/persistance/drizzle/schema';
import { studentsTable } from '../../student/infrastructure/students.table';

export const schema = {
  coursesTable,
  studentsTable,
};

export type Schema = typeof schema;
