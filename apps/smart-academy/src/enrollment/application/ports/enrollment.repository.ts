import { StudentId } from '../../../student/domain/value-objects/student-id.vo';
import { EnrollmentId } from '../../../common/domain/enrollment-id.vo';
import { Enrollment } from '../../domain/enrollment.entity';
import { CourseId } from '../../../course/domain/value-objects/course-id.vo';

export abstract class EnrollmentRepository {
  abstract findById(id: EnrollmentId): Promise<Enrollment | null>;
  abstract findByStudentIdAndCourseId(
    studentId: StudentId,
    courseId: CourseId
  ): Promise<Enrollment | null>;
}
