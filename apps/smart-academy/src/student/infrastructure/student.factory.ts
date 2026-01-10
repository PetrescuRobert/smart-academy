import { Injectable } from '@nestjs/common';
import { Student } from '../domain/student.entity';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { StudentModel } from '../../common/database/schema/students.table';
import { Email } from '../domain/value-objects/email.vo';

@Injectable()
export class StudentFactory {
  create({
    firstName,
    lastName,
    email,
    profilePicture,
  }: Omit<StudentModel, 'id'>): Student {
    return new Student(
      new StudentId(null),
      firstName,
      lastName,
      new Email(email),
      profilePicture
    );
  }

  hydrate({
    id,
    firstName,
    lastName,
    email,
    profilePicture,
  }: StudentModel): Student {
    return new Student(
      new StudentId(id),
      firstName,
      lastName,
      new Email(email),
      profilePicture
    );
  }
}
