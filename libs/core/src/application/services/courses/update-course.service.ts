import { UpdateCourseCommand } from '../../dto/update-course.command';
import { CourseRepository } from '../../ports/course.repository';

export class UpdateCourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(updateCourseCommand: UpdateCourseCommand) {
    const existingCourse = await this.courseRepository.findCourseById(
      updateCourseCommand.id
    );

    if (updateCourseCommand.title) {
      existingCourse.updateTitle(updateCourseCommand.title);
    }

    if (updateCourseCommand.description) {
      existingCourse.updateDescription(updateCourseCommand.description);
    }

    if (
      updateCourseCommand.active !== undefined &&
      updateCourseCommand.active === true
    ) {
      existingCourse.activate();
    }

    if (
      updateCourseCommand.active !== undefined &&
      updateCourseCommand.active === false
    ) {
      existingCourse.deactivate();
    }

    this.courseRepository.save(existingCourse);
    return existingCourse;
  }
}
