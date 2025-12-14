import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  Course,
  CreateCourseCommand,
  CreateCourseService,
  GetCourseService,
} from '@smart-academy/core';

@Controller('courses')
export class CourseController {
  constructor(
    @Inject() private readonly createCourseService: CreateCourseService,
    @Inject() private readonly getCourseService: GetCourseService
  ) {}

  @Get(':id')
  async getCourseById(@Param('id') id: string): Promise<Course> {
    const course = await this.getCourseService.execute(id);
    return course;
  }

  @Post()
  async createCourse(
    @Body() createCourseCommand: CreateCourseCommand
  ): Promise<string> {
    return this.createCourseService.execute(createCourseCommand);
  }
}
