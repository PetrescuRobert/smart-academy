import { Course } from '../../../domain/entities';
import { CourseId } from '../../../domain/value-objects/course-id.vo';
import { CreateCourseCommand } from '../../dto/create-course.command';
import { CourseRepository } from '../../ports/course.repository';

export class CreateCourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(command: CreateCourseCommand): Promise<string> {
    // Delegate to Domain (Create the Entity)
    const course = Course.createNew(command.name, command.description);

    // Delegate to Infrastructure (Save)
    let savedId: CourseId;
    try {
      savedId = await this.courseRepository.save(course);
    } catch (e) {
      console.log(e);
      throw new Error(
        'Unable to save the course to the database, please try again later'
      );
    }

    if (!savedId || !savedId.value) {
      throw new Error('Assigning a unique ID to the course failed!');
    }

    // Return primitive result (ID assigned by the DB)
    return savedId.value;
  }
}
