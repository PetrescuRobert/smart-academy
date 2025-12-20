import { Module } from '@nestjs/common';
import { CourseRepository } from '../../../application/ports/course.repository';
import { InMemoryCourseRepository } from './repositories/course.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: CourseRepository,
      useClass: InMemoryCourseRepository,
    },
  ],
  exports: [CourseRepository],
})
export class InMemoryPersistanceModule {}
