import { BaseEntity } from '../abstract/base.entity.js';
import { CourseId } from '../value-objects/course-id.vo.js';

export class Course extends BaseEntity<CourseId> {
  private _title: string;
  private _description: string;
  private _isActive: boolean;

  private constructor(
    id: CourseId,
    title: string,
    description: string,
    isActive: boolean
  ) {
    super(id);
    this._title = title;
    this._description = description;
    this._isActive = isActive;
  }

  public static create(
    id: CourseId,
    title: string,
    description: string
  ): Course {
    // can add validation for course creation like constraints for name
    Course.validateCreationParams(title, description);

    return new Course(id, title, description, false);
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  private static validateCreationParams(
    title: string,
    description: string
  ): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Course title cannot be empty.');
    }
    // You could add description validation here too.
    if (!description || description.trim().length < 10) {
      throw new Error(
        'Course description must be at least 10 characters long.'
      );
    }
  }

  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get isActive(): boolean {
    return this._isActive;
  }
}
