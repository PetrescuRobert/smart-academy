import { Inject, Injectable, Logger } from '@nestjs/common';
import { StudentRepository } from '../application/ports/student.repository';
import { Student } from '../domain/student.entity';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { DATA_SOURCE } from '../../common/database/constants';
import { DataSource } from '../../common/drizzle/drizzle.interfaces';
import { Schema } from '../../common/database/schema';
import { StudentFactory } from './student.factory';
import { StudentModel, studentsTable } from './students.table';
import { eq } from 'drizzle-orm';
import { PersistanceException } from '../../common/exceptions/persistance.exception';

@Injectable()
export class StudentRepositoryImpl implements StudentRepository {
  private readonly logger = new Logger(StudentRepositoryImpl.name);

  constructor(
    @Inject(DATA_SOURCE) private readonly db: DataSource<Schema>,
    private readonly factory: StudentFactory
  ) {}

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
      queryResult = await this.db
        .insert(studentsTable)
        .values({
          id: student.getId.value,
          firstName: student.getFirstName,
          lastName: student.getLastName,
          email: student.getEmail.value,
          profilePicture: student.getProfilePicture,
        })
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
