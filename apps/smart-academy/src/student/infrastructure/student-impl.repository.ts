import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { DATA_SOURCE } from '../../common/database/constants';
import { Schema } from '../../common/database/schema';
import { DataSource } from '../../common/drizzle/drizzle.interfaces';
import { PersistanceException } from '../../common/exceptions/persistance.exception';
import {
  fieldToSqlColumn,
  translateFilters,
} from '../../common/utils/filters/functions';
import { FindStudentsQuery } from '../application/commands/find-students.query';
import { StudentRepository } from '../application/ports/student.repository';
import { Student } from '../domain/student.entity';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { StudentFactory } from './student.factory';
import {
  StudentModel,
  studentsTable,
} from '../../common/database/schema/students.table';

@Injectable()
export class StudentRepositoryImpl implements StudentRepository {
  private readonly logger = new Logger(StudentRepositoryImpl.name);

  constructor(
    @Inject(DATA_SOURCE) private readonly db: DataSource<Schema>,
    private readonly factory: StudentFactory
  ) {}

  async findAll(query: FindStudentsQuery): Promise<[Student[], number]> {
    let queryResult: StudentModel[] = [];
    let totalResults: number;

    try {
      const filters = translateFilters(studentsTable, query.filters);
      const orderByColumn = fieldToSqlColumn(query.sort.by, studentsTable);
      const orderByClause =
        query.sort.direction === 'asc'
          ? asc(orderByColumn)
          : desc(orderByColumn);

      queryResult = await this.db
        .select()
        .from(studentsTable)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(orderByClause)
        .limit(query.limit)
        .offset(query.offset);

      [{ totalResults }] = await this.db
        .select({ totalResults: count() })
        .from(studentsTable)
        .where(filters.length > 0 ? and(...filters) : undefined);
    } catch (e) {
      this.logger.error(
        'Failed to query the database while trying to fetch students by filters',
        e
      );
      throw new PersistanceException(
        'Failed to query the database while trying to fetch students by filters'
      );
    }

    return [queryResult.map(this.factory.hydrate), totalResults];
  }

  async findById(studentId: StudentId): Promise<Student> {
    let queryResult: StudentModel[];
    try {
      queryResult = await this.db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.id, studentId.value));
    } catch (e) {
      this.logger.error(
        'Failed to query the database while trying to fetch a student by id',
        e
      );
      throw new PersistanceException(
        `Failed while fetching the student with id: ${studentId.value}`
      );
    }

    if (queryResult.length === 0) {
      return null;
    }

    return this.factory.hydrate(queryResult[0]);
  }

  async save(student: Student): Promise<Student> {
    let queryResult: StudentModel[] = null;
    try {
      const valueToInsert = {
        id: student.getId.value ? student.getId.value : sql`default`,
        firstName: student.getFirstName,
        lastName: student.getLastName,
        email: student.getEmail.value,
        profilePicture: student.getProfilePicture,
      };

      queryResult = await this.db
        .insert(studentsTable)
        .values(valueToInsert)
        .onConflictDoUpdate({
          target: studentsTable.id,
          set: {
            firstName: student.getFirstName,
            lastName: student.getLastName,
            email: student.getEmail.value,
            profilePicture: student.getProfilePicture,
          },
        })
        .returning();
    } catch (e) {
      this.logger.error('Failed to save a student in the db', e);
      throw new PersistanceException('Failed while saving to the database!');
    }

    if (queryResult.length === 0) {
      return null;
    }

    return this.factory.hydrate(queryResult[0]);
  }
}
