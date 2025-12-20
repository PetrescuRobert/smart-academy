import { Course } from '../../../domain/entities/course.entity';

export class CourseDto {
  id: string;
  title: string;
  description: string;
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
