import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ApplicationBootstrapOptions } from './common/application-bootstrap-options';
import { CourseModule } from './course/application/course.module';
import { CourseInfrastructureModule } from './course/infrastructure/course-infrastrucure.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BootstrapModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        BootstrapModule.forRoot(options),
        CourseModule.withInfrastructure(
          CourseInfrastructureModule.use(options.driver)
        ),
      ],
    };
  }
}
