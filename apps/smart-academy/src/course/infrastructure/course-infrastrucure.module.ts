import { Module } from '@nestjs/common';
import { DrizzleModule } from '../../common/drizzle/drizzle.module';
import { CourseRepository } from '../application/ports/course.repository';
import { PostgresCourseRepository } from './persistance/drizzle/repositories/course.repository';
import { CourseFactory } from '../domain/factories/course.factory';

@Module({
  imports: [],
  providers: [
    { provide: CourseRepository, useClass: PostgresCourseRepository },
    { provide: CourseFactory, useFactory: () => new CourseFactory() },
  ],
  exports: [CourseFactory, CourseRepository],
})
export class CourseInfrastructureModule {
  // static use(driver: 'drizzle' | 'in-memory'): DynamicModule {
  //   const persistanceModule =
  //     driver === 'drizzle'
  //       ? DrizzleModule.forRoot({ name: DATA_SOURCE, schema: schema })
  //       : InMemoryPersistanceModule;
  //   return {
  //     module: CourseInfrastructureModule,
  //     imports: [],
  //     providers: [
  //       { provide: CourseRepository, useClass: PostgresCourseRepository },
  //     ],
  //     exports: [],
  //   };
  // }
}
