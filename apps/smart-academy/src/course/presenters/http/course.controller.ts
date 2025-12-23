import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CourseService } from '../../application/course.service';
import { CourseDto } from './dtos/course.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(@Inject() private readonly courseService: CourseService) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The course id is a UUID v7',
  })
  @ApiOkResponse({
    description: 'Get a course by id',
    type: CourseDto,
  })
  @ApiNotFoundResponse({
    description: 'If a course with the provided ID does not exists!',
  })
  async getCourseById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CourseDto> {
    const course = await this.courseService.findById(id);
    return CourseDto.fromEntity(course);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The course has been successfully created',
    type: CourseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request failed at least one validation',
  })
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

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'The course id is a UUID v7',
  })
  @ApiOkResponse({
    description: 'This will return back the updated course!',
    type: CourseDto,
  })
  @ApiNotFoundResponse({
    description: 'If a course with the provided ID does not exists!',
  })
  async updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    const updatedCourse = await this.courseService.update({
      ...updateCourseDto,
      id,
    });
    return CourseDto.fromEntity(updatedCourse);
  }
}
