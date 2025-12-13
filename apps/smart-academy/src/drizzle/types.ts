import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type PostgresDatabase = NodePgDatabase<typeof schema>;
export const DRIZZLE = 'DRIZZLE';
