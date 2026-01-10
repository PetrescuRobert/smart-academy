import { eq, SQL } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { PersistanceException } from '../../exceptions/persistance.exception';
import { Filter } from './types';

/**
 * Convert an array of filter objects into SQL predicate expressions for the given table.
 *
 * @param table - The Postgres table whose columns are referenced by the filters
 * @param filters - Array of filter objects, each providing `field`, `operator`, and `value`
 * @returns An array of SQL expressions corresponding to each filter
 */
export function translateFilters(
  table: PgTable,
  filters: Filter<any>[]
): SQL[] {
  return filters.map((filter) =>
    operatorToSqlFunc({
      table,
      operator: filter.operator,
      value: filter.value,
      field: String(filter.field),
    })
  );
}

/**
 * Convert a single operator condition into a drizzle-orm SQL expression for a column on the provided table.
 *
 * @param table - The target `PgTable` containing the column referenced by `field`
 * @param operator - The operator name (e.g., `'eq'`) to apply
 * @param field - The name of the column on `table` to compare
 * @param value - The value to compare the column against
 * @returns A `SQL` expression representing the operator applied to the specified column and value
 * @throws PersistanceException when the operator is not supported
 */
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

/**
 * Resolve a column name on a Postgres table into its corresponding PgColumn.
 *
 * @param field - The column name to resolve on the provided table
 * @param table - The PgTable to look up the column on
 * @returns The `PgColumn` for `field` on `table`
 * @throws PersistanceException When `field` does not exist on `table` (message: "Invalid column name!")
 */
export function fieldToSqlColumn(field: string, table: PgTable): PgColumn {
  if (!table[field]) {
    throw new PersistanceException('Invalid column name!');
  }
  return table[field];
}
