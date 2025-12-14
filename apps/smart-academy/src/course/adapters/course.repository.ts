import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '@smart-academy/core';
import { Course } from '@smart-academy/core';
import { CourseId } from '@smart-academy/core';
import { DRIZZLE, PostgresDatabase } from '../../drizzle/types';
import { CourseModel, coursesTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostgresCourseRepository implements CourseRepository {
  private readonly logger = new Logger(PostgresCourseRepository.name);

  constructor(@Inject(DRIZZLE) private readonly db: PostgresDatabase) {}

  async findCourseById(courseId: string): Promise<Course> {
    this.logger.log(`Fetching the course with ID: ${courseId}`);
    let queryResult: CourseModel[] = null;
    try {
      queryResult = await this.db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, courseId));
    } catch (e) {
      this.logger.error(e);
    }

    if (!queryResult || queryResult.length === 0) {
      throw new NotFoundException(`Can't find course with id: ${courseId}`);
    }

    return Course.reconstruct(queryResult[0]);
  }

  async save(course: Course): Promise<CourseId> {
    try {
      // If the entity already has an id, update it
      if (course.id && !course.id.isEmpty()) {
        await this.db
          .update(coursesTable)
          .set({
            title: course.title,
            description: course.description,
            active: course.isActive,
          })
          .where(eq(coursesTable.id, course.id.value));
        return course.id;
      }

      // Let the DB generate the id and return it (Drizzle supports returning)
      const result = await this.db
        .insert(coursesTable)
        .values({
          title: course.title,
          description: course.description,
          active: course.isActive,
        })
        .returning({ id: coursesTable.id });

      // result may be an array or object depending on driver
      const insertedId = Array.isArray(result) ? result[0]?.id : null;

      if (!insertedId) {
        this.logger.error('Insert did not return an id', result);
        return new CourseId(null);
      }

      return new CourseId(insertedId);
    } catch (e) {
      this.logger.error(
        `An error occured while inserting the course with ID: ${course.id?.value}`,
        e
      );
      return new CourseId(course.id?.value ?? null);
    }
  }
}
