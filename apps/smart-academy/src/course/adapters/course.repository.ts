import { Inject, Injectable, Logger } from '@nestjs/common';
import { CourseRepository } from '@smart-academy/core';
import { Course } from '@smart-academy/core';
import { CourseId } from '@smart-academy/core';
import { DRIZZLE, PostgresDatabase } from '../../drizzle/types';
import { coursesTable } from '../../drizzle/schema';

@Injectable()
export class PostgresCourseRepository implements CourseRepository {
  private readonly logger = new Logger(PostgresCourseRepository.name);

  constructor(@Inject(DRIZZLE) private readonly db: PostgresDatabase) {}

  async getCourseById(courseId: string): Promise<Course> {
    const queryResult = await this.db.query.coursesTable.findFirst({
      with: {
        id: courseId,
      },
    });
    return Course.reconstruct(queryResult);
  }

  async save(course: Course): Promise<CourseId> {
    try {
      await this.db.insert(coursesTable).values({
        id: course.id.value,
        title: course.title,
        description: course.description,
        active: course.isActive,
      });
    } catch (e) {
      this.logger.error(
        `An error occured while inserting the course with ID: ${course.id}`,
        e
      );
    }
    return course.id;
  }
}
