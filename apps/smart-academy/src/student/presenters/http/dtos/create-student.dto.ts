import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(12)
  firstName: string;
  @IsString()
  @MinLength(2)
  @MaxLength(12)
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  profilePicture: string | null;
}
