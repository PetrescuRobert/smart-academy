import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CreateCourseService, GetCourseService } from '@smart-academy/core';
import { PostgresCourseRepository } from './adapters/course.repository';
import { UuidGeneratorImpl } from './adapters/uuid-generator';

@Module({
  controllers: [CourseController],
  providers: [
    PostgresCourseRepository,
    UuidGeneratorImpl,
    {
      provide: CreateCourseService,
      useFactory: (
        repository: PostgresCourseRepository,
        uuidGen: UuidGeneratorImpl
      ) => new CreateCourseService(repository, uuidGen),
      inject: [PostgresCourseRepository, UuidGeneratorImpl],
    },
    {
      provide: GetCourseService,
      useFactory: (repository: PostgresCourseRepository) =>
        new GetCourseService(repository),
      inject: [PostgresCourseRepository],
    },
  ],
})
export class CourseModule {}
