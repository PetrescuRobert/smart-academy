import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { StudentService } from '../../application/student.service';
import { CreateStudentDto } from './dtos/create-student.dto';
import { SearchStudentsQuery } from './dtos/search-students-query.dto';
import { StudentDto } from './dtos/student.dto';

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
  async createNewStudent(@Body() createStudentDto: CreateStudentDto) {
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
