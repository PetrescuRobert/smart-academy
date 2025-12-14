import { Course } from '../../../domain/entities/course.entity';
import { CourseRepository } from '../../ports/course.repository';

export class GetCourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(courseId: string): Promise<Course> {
    const course = await this.courseRepository.findCourseById(courseId);
    return course;
  }
}
