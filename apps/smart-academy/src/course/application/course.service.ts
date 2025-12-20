import { Injectable } from '@nestjs/common';
import { CourseRepository } from './ports/course.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { CreateCourseCommand } from './commands/create-course-command';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly courseFactory: CourseFactory
  ) {}

  create(createCourseCommand: CreateCourseCommand) {
    const course = this.courseFactory.create(
      createCourseCommand.title,
      createCourseCommand.description,
      createCourseCommand.active
    );

    return this.courseRepository.save(course);
  }
}
