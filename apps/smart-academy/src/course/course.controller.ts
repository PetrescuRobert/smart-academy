import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateCourseCommand, CreateCourseService } from '@smart-academy/core';

@Controller('course')
export class CourseController {
  constructor(
    @Inject() private readonly createCourseService: CreateCourseService
  ) {}

  @Post()
  getCourseById(@Body() createCourseCommand: CreateCourseCommand) {
    return this.createCourseService.execute(createCourseCommand);
  }
}
