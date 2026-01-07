import { PersistanceException } from '../../exceptions/persistance.exception';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import {
  translateFilters,
  operatorToSqlFunc,
  fieldToSqlColumn,
} from './functions';

describe('SQL Filters helpers', () => {
  const fakeTable = {
    _: { columns: { firstName: 'col_firstName', age: 'col_age' } },
  } as unknown as PgTable;

  describe('fieldToSqlColumn', () => {
    it('returns the column corresponding to the field name', () => {
      const col = fieldToSqlColumn('firstName', fakeTable);
      expect(col).toBe('col_firstName');
    });

    it('throws error for unknown fields', () => {
      expect(() => fieldToSqlColumn('unknown', fakeTable)).toThrow(
        PersistanceException
      );
    });
  });

  describe('operatorToSqlFunc', () => {
    it('returns a bound function for eq operator and delegates to fieldToSqlColumn', () => {
      const fieldSpy: jest.Mock<PgColumn, [string, PgTable]> = jest
        .fn()
        .mockReturnValue('col_firstName' as unknown as PgColumn);

      const thisCtx: { fieldToSqlColumn: (f: string, t: PgTable) => PgColumn } =
        {
          fieldToSqlColumn: fieldSpy,
        };

      const boundFn = operatorToSqlFunc.call(thisCtx, {
        table: fakeTable,
        operator: 'eq',
        field: 'firstName',
        value: 'John',
      });

      expect(typeof boundFn).toBe('function');
      // fieldToSqlColumn must have been called with the field and table
      expect(fieldSpy).toHaveBeenCalledWith('firstName', fakeTable);

      // invoking the returned function shouldn't throw and should return an SQL-like value
      const sqlValue = boundFn();
      expect(sqlValue).toBeDefined();
    });

    it('throws PersistanceException for unknown operators', () => {
      const thisCtx = {} as Record<string, never>;
      expect(() =>
        operatorToSqlFunc.call(thisCtx, {
          table: fakeTable,
          operator: 'notAnOperator',
          field: 'firstName',
          value: '%x% ',
        })
      ).toThrow(PersistanceException);
    });
  });

  describe('translateFilters', () => {
    it('maps each filter to a SQL expression using operatorToSqlFunc', () => {
      // spy that will capture calls and return a simple function
      type OperatorParams = {
        table: PgTable;
        operator: 'eq' | 'like' | 'in';
        field: string;
        value: unknown;
      };
      const opSpy: jest.Mock<() => string, [OperatorParams]> = jest
        .fn()
        .mockReturnValue(() => 'SQL_EXPR');

      const filters = [
        { field: 'firstName', operator: 'eq', value: 'Alice' },
        { field: 'age', operator: 'eq', value: 30 },
      ];

      const thisCtx: {
        operatorToSqlFunc: (p: OperatorParams) => () => string;
      } = {
        operatorToSqlFunc: opSpy as unknown as (
          p: OperatorParams
        ) => () => string,
      };

      const result = translateFilters.call(thisCtx, fakeTable, filters);

      // operatorToSqlFunc should have been called for each filter with expected args
      expect(opSpy).toHaveBeenCalledTimes(2);
      expect(opSpy).toHaveBeenCalledWith({
        table: fakeTable,
        operator: 'eq',
        field: 'firstName',
        value: 'Alice',
      });

      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('function');
      expect(result[0]()).toBe('SQL_EXPR');
    });

    it('returns an empty array when no filters are provided', () => {
      const thisCtx: { operatorToSqlFunc: (p: any) => any } = {
        operatorToSqlFunc: jest.fn(),
      };
      const result = translateFilters.call(thisCtx, fakeTable, []);
      expect(result).toEqual([]);
    });
  });
});
