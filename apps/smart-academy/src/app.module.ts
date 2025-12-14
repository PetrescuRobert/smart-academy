import { Module } from '@nestjs/common';
import { CourseModule } from './course/course.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule.forRootAsync(),
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
