import { CourseRepository } from '../../../../application/ports/course.repository';
import { Course } from '../../../../domain/entities/course.entity';
import { InMemoryCourseModel } from '../schema/courses.table';

export class InMemoryCourseRepository implements CourseRepository {
  private readonly courses = new Map<string, InMemoryCourseModel>();

  async findAll(): Promise<Course[]> {
    throw new Error('Method not implemented.');
  }
  async save(course: Course): Promise<Course> {
    throw new Error('Method not implemented.');
  }
}
