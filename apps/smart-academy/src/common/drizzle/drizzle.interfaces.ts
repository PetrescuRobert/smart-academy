import { Table } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleModuleOptions = {
  name: string | symbol;
  schema: Record<string, Table>;
};

export type DataSource<TSchema extends Record<string, unknown>> =
  NodePgDatabase<TSchema>;
