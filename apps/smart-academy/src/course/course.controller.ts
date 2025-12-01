import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
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
  async getCourseById(@Param('id') id: string) {
    const course = await this.getCourseService.execute(id);
    return course;
  }

  @Post()
  async createCourse(@Body() createCourseCommand: CreateCourseCommand) {
    return this.createCourseService.execute(createCourseCommand);
  }
}
