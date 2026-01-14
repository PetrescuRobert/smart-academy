import { CourseId } from '../../course/domain/value-objects/course-id.vo';
import { StudentId } from '../../student/domain/value-objects/student-id.vo';
import { Achievement } from './achievement.entity';
import { EnrollmentId } from './value-objects/enrollment-id.vo';

export class Enrollment {
  private constructor(
    public readonly id: EnrollmentId,
    public readonly studentId: StudentId,
    public readonly courseId: CourseId,
    public readonly achievements: Achievement[],
    public readonly createdAt: Date
  ) {}

  static initializeEnrollment(
    id: EnrollmentId,
    studentId: StudentId,
    courseId: CourseId
  ) {
    return new Enrollment(id, studentId, courseId, null, new Date());
  }

  addStudentAchievement(achievement: Achievement) {
    this.achievements.push(achievement);
  }
}
