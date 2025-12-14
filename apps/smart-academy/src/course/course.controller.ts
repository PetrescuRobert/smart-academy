import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  Course,
  CreateCourseCommand,
  CreateCourseService,
  GetCourseService,
  UpdateCourseCommand,
  UpdateCourseService,
} from '@smart-academy/core';

@Controller('courses')
export class CourseController {
  constructor(
    @Inject() private readonly createCourseService: CreateCourseService,
    @Inject() private readonly getCourseService: GetCourseService,
    @Inject() private readonly updateCourseService: UpdateCourseService
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

  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseCommand: UpdateCourseCommand
  ) {
    return this.updateCourseService.execute({ ...updateCourseCommand, id });
  }
}
