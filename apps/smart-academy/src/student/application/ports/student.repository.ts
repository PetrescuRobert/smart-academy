import { Student } from '../../domain/student.entity';
import { StudentId } from '../../domain/value-objects/student-id.vo';
import { FindStudentsQuery } from '../commands/find-students.query';

export abstract class StudentRepository {
  abstract findById(studentId: StudentId): Promise<Student | null>;
  abstract findAll(query: FindStudentsQuery): Promise<[Student[], number]>;
  abstract save(student: Student): Promise<Student>;
}
