import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(12)
  firstName: string;
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(12)
  lastName: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profilePicture: string | null;
}
