import { Course } from '../../domain/entities';
import { CourseId } from '../../domain/value-objects/course-id.vo';
import { CreateCourseCommand } from '../dto/create-course.command';
import { CourseRepository } from '../ports/course.repository';
import { UuidGenerator } from '../ports/uuid-generator.interface';

export class CreateCourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly idGenerator: UuidGenerator
  ) {}

  async execute(command: CreateCourseCommand): Promise<string> {
    // Prepare Data (Generate ID)
    const idString = this.idGenerator.generate();
    const courseId = new CourseId(idString);

    // Delegate to Domain (Create the Entity)
    const course = Course.create(courseId, command.name, command.description);

    // Delegate to Infrastructure (Save)
    try {
      await this.courseRepository.save(course);
    } catch (e) {
      console.log(e);
      throw new Error(
        `Unable to save the course with ID:${courseId.value} to the database, please try again later`
      );
    }

    // Return primitive result (ID)
    return courseId.value;
  }
}
