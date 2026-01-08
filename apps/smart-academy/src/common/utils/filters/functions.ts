import { eq, SQL } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { PersistanceException } from '../../exceptions/persistance.exception';
import { Filter } from './types';

export function translateFilters(
  table: PgTable,
  filters: Filter<any>[]
): SQL[] {
  return filters.map((filter) =>
    operatorToSqlFunc({
      table,
      operator: (filter as any).operator as string,
      value: (filter as any).value,
      field: String((filter as any).field),
    })
  );
}

export function operatorToSqlFunc({
  table,
  operator,
  field,
  value,
}: {
  table: PgTable;
  operator: string;
  field: string;
  value: unknown;
}): SQL {
  switch (operator) {
    case 'eq':
      return eq(fieldToSqlColumn(field, table), value);
    // case 'lte':
    //   return lte(fieldToSqlColumn(field, studentsTable), value);
    default:
      throw new PersistanceException('Unknown operator!');
  }
}

export function fieldToSqlColumn(field: string, table: PgTable): PgColumn {
  if (!table[field]) {
    throw new PersistanceException('Invalid column name!');
  }
  return table[field];
}
