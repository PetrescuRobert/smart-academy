import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseRepository } from './ports/course.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { CreateCourseCommand } from './commands/create-course-command';
import { Course } from '../domain/entities/course.entity';
import { DomainException } from '../domain/exceptions/domain.exception';

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
}
