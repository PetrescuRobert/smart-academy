import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DomainException } from '../../common/exceptions/domain.exception';
import { PersistanceException } from '../../common/exceptions/persistance.exception';
import { StudentFactory } from '../infrastructure/student.factory';
import { CreateStudentCommand } from './commands/create-student.command';
import { StudentRepository } from './ports/student.repository';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { Student } from '../domain/student.entity';
import { FindStudentsQuery } from './commands/find-students.query';
import { UpdateStudentCommand } from './commands/update-student.command';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    private readonly repository: StudentRepository,
    private readonly factory: StudentFactory
  ) {}

  async createStudent(createStudentCommand: CreateStudentCommand) {
    this.logger.log(
      `Creating student - ${
        createStudentCommand.firstName + ' ' + createStudentCommand.lastName
      } - with email ${createStudentCommand.email}`
    );
    try {
      const newStudent = this.factory.create(createStudentCommand);
      const savedStudent = await this.repository.save(newStudent);
      this.logger.log(
        `Student ${
          createStudentCommand.firstName + ' ' + createStudentCommand.lastName
        } created successfully`
      );
      return savedStudent;
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof PersistanceException) {
        throw new ServiceUnavailableException();
      }

      if (e instanceof DomainException) {
        throw new BadRequestException(e.message);
      }
    }
  }

  async findById(studentId: string) {
    if (!studentId) {
      throw new BadRequestException();
    }

    let student: Student = null;
    try {
      student = await this.repository.findById(new StudentId(studentId));
    } catch (e) {
      if (e instanceof PersistanceException) {
        throw new ServiceUnavailableException();
      }
    }

    if (!student) {
      throw new NotFoundException("Doesn't exists!");
    }

    return student;
  }

  async findAll(findStudentsQuery?: FindStudentsQuery) {
    let students: Student[] = null;

    try {
      students = await this.repository.findAll(findStudentsQuery);
    } catch (e) {
      if (e instanceof PersistanceException) {
        throw new ServiceUnavailableException();
      }
    }

    return students;
  }

  async update(updateStudentCommand: UpdateStudentCommand) {
    throw new Error();
  }
}
