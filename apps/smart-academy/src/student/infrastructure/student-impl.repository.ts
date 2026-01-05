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
      this.logger.error(e);
      throw new PersistanceException(
        `Failed while fetching the student with id: ${studentId.value}`
      );
    }

    if (queryResult.length === 0) {
      return null;
    }

    return this.factory.hydrate(queryResult[0]);
  }

  save(student: Student): Promise<Student> {
    throw new Error('Method not implemented.');
  }
}
