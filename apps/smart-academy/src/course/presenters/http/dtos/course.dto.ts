import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../../domain/entities/course.entity';

export class CourseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive: boolean;

  private constructor(
    id: string,
    title: string,
    description: string,
    isActive: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isActive = isActive;
  }

  public static fromEntity(entity: Course) {
    return new CourseDto(
      entity.id.value,
      entity.title,
      entity.description,
      entity.isActive
    );
  }
}
