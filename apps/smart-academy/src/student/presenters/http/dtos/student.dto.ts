import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../../../domain/student.entity';

export class StudentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePicture: string;

  private constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePicture = profilePicture;
  }

  public static fromEntity(entity: Student) {
    return new StudentDto(
      entity.getId.value,
      entity.getFirstName,
      entity.getLastName,
      entity.getEmail.value,
      entity.getProfilePicture
    );
  }
}
