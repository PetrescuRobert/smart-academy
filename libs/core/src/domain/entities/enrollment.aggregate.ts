import { BaseEntity } from '../abstract/base.entity.js';
import { EnrollmentId } from '../value-objects/enrollment-id.vo.js';
import { CourseId } from '../value-objects/course-id.vo.js';
import { StudentId } from '../value-objects/student-id.vo.js';

export class Enrollment extends BaseEntity<EnrollmentId> {
  private _courseId: CourseId;
  private _studentId: StudentId;
  private _grade: number | null;

  private constructor(
    id: EnrollmentId,
    courseId: CourseId,
    studentId: StudentId,
    grade: number | null = null
  ) {
    super(id);
    this._courseId = courseId;
    this._studentId = studentId;
    this._grade = grade;
  }

  // Use for new domain creations (business rules applied)
  public static create(
    id: EnrollmentId,
    courseId: CourseId,
    studentId: StudentId,
    grade: number | null
  ): Enrollment {
    Enrollment.validateIds(courseId, studentId);

    if (grade) {
      Enrollment.validateGrade(grade);
    }

    return new Enrollment(id, courseId, studentId, grade);
  }

  // Domain operation to assign or change grade
  assignGrade(grade: number): void {
    Enrollment.validateGrade(grade);
    this._grade = grade;
  }

  get courseId(): CourseId {
    return this._courseId;
  }

  get studentId(): StudentId {
    return this._studentId;
  }

  get grade(): number | null {
    return this._grade;
  }

  private static validateIds(courseId: CourseId, studentId: StudentId): void {
    if (!courseId) throw new Error('CourseId is required.');
    if (!studentId) throw new Error('StudentId is required.');
  }

  private static validateGrade(grade: number): void {
    if (!Number.isFinite(grade) || !Number.isInteger(grade)) {
      throw new Error('Grade must be an integer.');
    }
    if (grade < 1 || grade > 10) {
      throw new Error('Grade must be between 1 and 10.');
    }
  }
}
