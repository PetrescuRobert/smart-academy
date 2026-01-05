import { coursesTable } from '../../course/infrastructure/persistance/drizzle/schema';

export const schema = {
  coursesTable,
};

export type Schema = typeof schema;
