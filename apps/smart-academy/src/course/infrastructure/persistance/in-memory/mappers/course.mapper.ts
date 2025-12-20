import { CourseId } from '../../../../domain/value-objects/course-id.vo';
import { InMemoryCourseModel } from '../schema/courses.table';
import { Course } from '../../../../domain/entities/course.entity';

export class CourseMapper {
  static toDomain(courseModel: InMemoryCourseModel) {
    const courseId = new CourseId(courseModel.id);

    return new Course(
      courseId,
      courseModel.title,
      courseModel.description,
      courseModel.active
    );
  }

  static toPersistance(course: Course): InMemoryCourseModel {
    return {
      id: course.id.value,
      title: course.title,
      description: course.description,
      active: course.isActive,
    };
  }
}
