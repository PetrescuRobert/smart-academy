import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CourseService } from '../../application/course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { CourseDto } from './dtos/course.dto';

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
  ): Promise<CourseDto> {
    const course = await this.courseService.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      active: createCourseDto.active,
    });
    return CourseDto.fromEntity(course);
  }

  // @Patch(':id')
  // async updateCourse(
  //   @Param('id') id: string,
  //   @Body() updateCourseCommand: UpdateCourseCommand
  // ) {
  //   return this.updateCourseService.execute({ ...updateCourseCommand, id });
  // }
}
