import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The course title should not be empty' })
  title: string;
  @ApiProperty()
  @MinLength(10, { message: 'Description should be min. 10 characters long' })
  description: string;
  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
