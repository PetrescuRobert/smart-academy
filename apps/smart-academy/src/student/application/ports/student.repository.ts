import { Student } from '../../domain/student.entity';
import { StudentId } from '../../domain/value-objects/student-id.vo';

export abstract class StudentRepository {
  abstract findById(studentId: StudentId): Promise<Student | null>;
  abstract save(student: Student): Promise<Student>;
}
