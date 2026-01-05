import { Module } from '@nestjs/common';
import { StudentRepository } from '../application/ports/student.repository';
import { StudentRepositoryImpl } from './student-impl.repository';
import { StudentFactory } from './student.factory';

@Module({
  providers: [
    { provide: StudentRepository, useClass: StudentRepositoryImpl },
    StudentFactory,
  ],
  exports: [StudentRepository, StudentFactory],
})
export class StudentInfrastructureModule {}
