import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { StudentService } from '../../application/student.service';
import { CreateStudentDto } from './dtos/create-student.dto';
import { SearchStudentsQuery } from './dtos/search-students-query.dto';
import { StudentDto } from './dtos/student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { PaginatedResponse } from '../../../common/dtos/paginated-response.dto';

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
    const [students, studentsCount] = await this.service.findAll(domainQuery);
    return PaginatedResponse.of(
      students.map(StudentDto.fromEntity),
      query.limit,
      query.offset,
      studentsCount,
      query.sort,
      query.filters.map((f) => ({
        field: f.field,
        operator: f.operator,
        value: f.value,
      }))
    );
  }

  @Patch(':id')
  async updateStudentById(
    @Param('id', ParseUUIDPipe) studentId: string,
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    if (Object.keys(updateStudentDto).length === 0) {
      throw new BadRequestException('At least one property should be defined!');
    }

    const updatedStudent = await this.service.update({
      id: studentId,
      firstName: updateStudentDto.firstName,
      lastName: updateStudentDto.lastName,
      email: updateStudentDto.email,
      profilePicture: updateStudentDto.profilePicture,
    });

    return StudentDto.fromEntity(updatedStudent);
  }
}
