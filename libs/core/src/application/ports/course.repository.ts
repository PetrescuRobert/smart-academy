import { Course } from '../../domain/entities';
import { CourseId } from '../../domain/value-objects/course-id.vo';

export interface CourseRepository {
  getCourseById(courseId: string): Promise<Course>;
  save(course: Course): Promise<CourseId>;
}
