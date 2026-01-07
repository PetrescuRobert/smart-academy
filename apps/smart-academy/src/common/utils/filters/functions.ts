import { eq, SQL } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { PersistanceException } from '../../exceptions/persistance.exception';
import { Filter } from './types';

export function translateFilters(
  table: PgTable,
  filters: Filter<any>[]
): SQL[] {
  return filters.map((filter) =>
    this.operatorToSqlFunc({
      table,
      operator: filter.operator,
      value: filter.value,
      field: filter.field,
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
  operator: 'eq' | 'like' | 'in';
  field: string;
  value: unknown;
}): SQL {
  switch (operator) {
    case 'eq':
      return eq.bind(null, this.fieldToSqlColumn(field, table), value);
    // case 'lte':
    //   return lte(this.fieldToSqlColumn(field, studentsTable), value);
    default:
      throw new PersistanceException('Unknown operator!');
  }
}

export function fieldToSqlColumn(field: string, table: PgTable): PgColumn {
  if (!table._.columns[field]) {
    throw new PersistanceException('Invalid column name!');
  }
  return table._.columns[field];
}
