import { Course } from '../entities/course.entity';
import { CourseId } from '../value-objects/course-id.vo';

export class CourseFactory {
  create(title: string, description: string, active: boolean): Course {
    return new Course(null, title, description, active);
  }

  hydrate(object: {
    id: string;
    title: string;
    description: string;
    active: boolean;
  }) {
    const courseId = new CourseId(object.id);
    return new Course(
      courseId,
      object.title,
      object.description,
      object.active
    );
  }
}
