import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DomainException } from '../../common/exceptions/domain.exception';
import { PersistanceException } from '../../common/exceptions/persistance.exception';
import { StudentFactory } from '../infrastructure/student.factory';
import { CreateStudentCommand } from './commands/create-student.command';
import { StudentRepository } from './ports/student.repository';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    private readonly repository: StudentRepository,
    private readonly factory: StudentFactory
  ) {}

  async createStudent(createStudentCommand: CreateStudentCommand) {
    try {
      const newStudent = this.factory.create(createStudentCommand);
      const savedStudent = await this.repository.save(newStudent);
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
}
