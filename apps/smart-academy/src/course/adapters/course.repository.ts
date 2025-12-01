import { Injectable, Logger } from '@nestjs/common';
import { CourseRepository } from '@smart-academy/core';
import { Course } from '@smart-academy/core';
import { CourseId } from '@smart-academy/core';

@Injectable()
export class PostgresCourseRepository implements CourseRepository {
  private readonly db = new Map<string, Course>();
  private readonly logger = new Logger(PostgresCourseRepository.name);

  async getCourseById(courseId: string): Promise<Course | undefined> {
    return Promise.resolve(this.db.get(courseId));
  }

  async save(course: Course): Promise<CourseId> {
    this.db.set(course.id.value, course);
    this.logger.log(`Current db:${JSON.stringify([...this.db])}`);
    return Promise.resolve(course.id);
  }
}
