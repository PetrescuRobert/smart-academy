import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import {
  CreateCourseService,
  GetCourseService,
  UpdateCourseService,
} from '@smart-academy/core';
import { PostgresCourseRepository } from './adapters/course.repository';
@Module({
  controllers: [CourseController],
  providers: [
    PostgresCourseRepository,
    {
      provide: CreateCourseService,
      useFactory: (repository: PostgresCourseRepository) =>
        new CreateCourseService(repository),
      inject: [PostgresCourseRepository],
    },
    {
      provide: GetCourseService,
      useFactory: (repository: PostgresCourseRepository) =>
        new GetCourseService(repository),
      inject: [PostgresCourseRepository],
    },
    {
      provide: UpdateCourseService,
      useFactory: (repository: PostgresCourseRepository) =>
        new UpdateCourseService(repository),
      inject: [PostgresCourseRepository],
    },
  ],
})
export class CourseModule {}
