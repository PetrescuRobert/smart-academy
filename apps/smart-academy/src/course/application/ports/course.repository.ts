import { Course } from '../../domain/entities/course.entity';

export abstract class CourseRepository {
  abstract findAll(): Promise<Course[]>;
  abstract findById(courseId: string): Promise<Course>;
  abstract save(course: Course): Promise<Course>;
}
