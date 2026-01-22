import {
  AggregateRoot,
  DomainException,
  Id,
} from '@smart-academy/ddd-shared-kernel';
import { CourseId } from '../../course/domain/value-objects/course-id.vo';
import { StudentId } from '../../student/domain/value-objects/student-id.vo';
import { Achievement } from './achievement.entity';

export interface EnrollmentProps {
  studentId: StudentId;
  courseId: CourseId;
  achievements: Achievement[];
  createdAt: Date;
}

export type CreateEnrollmentProps = Omit<
  EnrollmentProps,
  'createdAt' | 'achievements'
> & { id: Id };

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  protected readonly _id: Id;

  public validate(): void {
    if (!this.id) {
      throw new DomainException(
        'Enrollment business validations failed! This aggregate root is not in a valid state!'
      );
    }
  }

  static create(props: CreateEnrollmentProps): Enrollment {
    const enrollment = new Enrollment({
      id: props.id,
      props: {
        studentId: props.studentId,
        courseId: props.courseId,
        createdAt: new Date(),
        achievements: null,
      },
    });

    return enrollment;
  }

  addStudentAchievement(achievement: Achievement) {
    this.props.achievements.push(achievement);
  }

  removeStudentAchievement(achievement: Achievement) {
    this.props.achievements = this.props.achievements.filter(
      (a) => !a.equals(achievement)
    );
  }
}
