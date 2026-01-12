import { Inject, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATA_SOURCE } from '../../../../../common/database/constants';
import { Schema } from '../../../../../common/database/schema';
import { DataSource } from '../../../../../common/drizzle/drizzle.interfaces';
import { CourseRepository } from '../../../../application/ports/course.repository';
import { Course } from '../../../../domain/entities/course.entity';
import { CourseFactory } from '../../../../domain/factories/course.factory';
import { PersistanceException } from '../../../../../common/exceptions/persistance.exception';
import {
  CourseModel,
  coursesTable,
} from '../../../../../common/database/schema/courses.table';

export class PostgresCourseRepository implements CourseRepository {
  private readonly logger = new Logger(PostgresCourseRepository.name);

  constructor(
    @Inject(DATA_SOURCE) private readonly db: DataSource<Schema>,
    private readonly factory: CourseFactory
  ) {}

  async findById(courseId: string): Promise<Course> {
    let queryResult: CourseModel[];
    try {
      queryResult = await this.db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, courseId));
    } catch (e) {
      this.logger.error(e);
      throw new PersistanceException(
        `Unable to fetch the course with ID: ${courseId} from the database`
      );
    }

    if (queryResult.length > 1) {
      this.logger.error(`Found multiple courses with the same ID: ${courseId}`);
      throw new PersistanceException(
        `Found multiple courses with the same ID: ${courseId}`
      );
    }

    if (queryResult.length == 0) {
      return null;
    }

    return this.factory.hydrate(queryResult[0]);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.db.select().from(coursesTable);
    return courses.map((course) => this.factory.hydrate(course));
  }
  /**
   * If id is NULL => new Course to be saved, if id not NULL => update entity
   * @param course Entity to be saved to db
   */
  async save(course: Course): Promise<Course> {
    if (!course.id) {
      return await this.insertNew(course);
    }

    return this.update(course);
  }

  private async insertNew(course: Course): Promise<Course> {
    if (course.id) {
      throw new Error(
        '[Persistance Error]: Cannot insert Course with existing id!'
      );
    }

    try {
      const savedCourse = await this.db
        .insert(coursesTable)
        .values({
          title: course.title,
          description: course.description,
          active: course.isActive,
        })
        .returning();

      return this.factory.hydrate(savedCourse[0]);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async update(course: Course): Promise<Course> {
    try {
      const savedCourse = await this.db
        .update(coursesTable)
        .set({
          title: course.title,
          description: course.description,
          active: course.isActive,
        })
        .returning();
      return this.factory.hydrate(savedCourse[0]);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
