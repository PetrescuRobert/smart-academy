import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourseService } from '../../application/course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCourseCommand } from '../../application/commands/create-course-command';

@Controller('courses')
export class CourseController {
  constructor(@Inject() private readonly courseService: CourseService) {}

  // @Get(':id')
  // async getCourseById(@Param('id') id: string): Promise<Course> {
  //   const course = await this.getCourseService.execute(id);
  //   return course;
  // }

  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto
  ): Promise<string> {
    const course = await this.courseService.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      active: createCourseDto.active,
    });
    return course.id.value;
  }

  // @Patch(':id')
  // async updateCourse(
  //   @Param('id') id: string,
  //   @Body() updateCourseCommand: UpdateCourseCommand
  // ) {
  //   return this.updateCourseService.execute({ ...updateCourseCommand, id });
  // }
}
