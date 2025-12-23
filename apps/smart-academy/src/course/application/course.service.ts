import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseRepository } from './ports/course.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { CreateCourseCommand } from './commands/create-course-command';
import { Course } from '../domain/entities/course.entity';
import { DomainException } from '../../common/exceptions/domain.exception';
import { UpdateCourseCommand } from './commands/update-course-command';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly courseFactory: CourseFactory
  ) {}

  create(createCourseCommand: CreateCourseCommand) {
    let course: Course;
    try {
      course = this.courseFactory.create(
        createCourseCommand.title,
        createCourseCommand.description,
        createCourseCommand.active
      );
    } catch (e) {
      if (e instanceof DomainException) {
        throw new BadRequestException(e.message);
      }
    }

    return this.courseRepository.save(course);
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID: ${courseId} not found!`);
    }
    return course;
  }

  async update(updateCourseCommand: UpdateCourseCommand) {
    const course = await this.courseRepository.findById(updateCourseCommand.id);

    if (!course) {
      throw new NotFoundException(
        `Course with ID: ${updateCourseCommand.id} not found!`
      );
    }

    if (updateCourseCommand.title) {
      course.updateTitle(updateCourseCommand.title);
    }

    if (updateCourseCommand.description) {
      course.updateDescription(updateCourseCommand.description);
    }

    if (
      updateCourseCommand.active !== undefined &&
      updateCourseCommand.active === true &&
      course.isActive === false
    ) {
      course.activate();
    }

    if (
      updateCourseCommand.active !== undefined &&
      updateCourseCommand.active === false &&
      course.isActive === true
    ) {
      course.deactivate();
    }

    const updatedCourse = await this.courseRepository.save(course);

    return updatedCourse;
  }
}
