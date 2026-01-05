import { Module } from '@nestjs/common';
import { CourseInfrastructureModule } from '../infrastructure/course-infrastrucure.module';
import { CourseController } from '../presenters/http/course.controller';
import { CourseService } from './course.service';
@Module({
  imports: [CourseInfrastructureModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [],
})
export class CourseModule {
  // static withInfrastructure(
  //   infrastructureModule: Type | DynamicModule
  // ): DynamicModule {
  //   return {
  //     module: CourseModule,
  //     imports: [infrastructureModule],
  //   };
  // }
}
