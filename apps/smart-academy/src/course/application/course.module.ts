import { DynamicModule, Module, Type } from '@nestjs/common';
import { CourseController } from '../presenters/http/course.controller';
import { CourseService } from './course.service';
import { CourseFactory } from '../domain/factories/course.factory';
@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseFactory],
})
export class CourseModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule
  ): DynamicModule {
    return {
      module: CourseModule,
      imports: [infrastructureModule],
    };
  }
}
