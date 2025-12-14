import { Course } from '../../../domain/entities/course.entity';
import { CourseRepository } from '../../ports/course.repository';

export class GetCourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(courseId: string): Promise<Course> {
    // TODO: check if courseId is a valid UUID
    try {
      const course = await this.courseRepository.getCourseById(courseId);
      return course;
    } catch (e) {
      console.log(e);
      throw new Error('Unable to fetch data from db!');
    }
  }
}
