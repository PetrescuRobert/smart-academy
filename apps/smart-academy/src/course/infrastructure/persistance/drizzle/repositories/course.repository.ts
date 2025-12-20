import { Inject } from '@nestjs/common';
import { CourseRepository } from '../../../../application/ports/course.repository';
import { Course } from '../../../../domain/entities/course.entity';
import { CourseFactory } from '../../../../domain/factories/course.factory';
import { coursesTable } from '../schema';
import { DRIZZLE, PostgresDatabase } from '../types';

export class PostgresCourseRepository implements CourseRepository {
  constructor(
    @Inject(DRIZZLE) private readonly db: PostgresDatabase,
    private readonly factory: CourseFactory
  ) {}

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
