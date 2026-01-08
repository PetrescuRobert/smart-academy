import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { StudentService } from '../../application/student.service';
import { SearchStudentsQuery } from './dtos/search-students-query.dto';
import { StudentDto } from './dtos/student.dto';
import { CreateStudentDto } from './dtos/create-student.dto';
import type { Request } from 'express';

@Controller('students')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly service: StudentService) {}

  @Get(':id')
  async getStudentById(@Param('id', ParseUUIDPipe) studentId: string) {
    const student = await this.service.findById(studentId);
    return StudentDto.fromEntity(student);
  }

  @Post()
  async createNewStudent(
    @Req() req: Request,
    @Body() createStudentDto: CreateStudentDto
  ) {
    this.logger.debug(createStudentDto);
    const newStudent = await this.service.createStudent(createStudentDto);
    return StudentDto.fromEntity(newStudent);
  }

  @Post('search')
  @HttpCode(200)
  async getAllStudents(@Body() query: SearchStudentsQuery) {
    const domainQuery = query.toDomain();
    const students = await this.service.findAll(domainQuery);
    return students.map(StudentDto.fromEntity);
  }
}
