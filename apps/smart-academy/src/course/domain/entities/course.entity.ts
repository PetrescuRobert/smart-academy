import { DomainException } from '../exceptions/domain.exception';
import { CourseId } from '../value-objects/course-id.vo';

export class Course {
  private _id: CourseId;
  private _title: string;
  private _description: string;
  private _isActive: boolean;

  constructor(
    id: CourseId,
    title: string,
    description: string,
    isActive: boolean
  ) {
    this.validateCreationParams(title, description);
    this._id = id;
    this._title = title;
    this._description = description;
    this._isActive = isActive;
  }

  /**
   * Used to recreate the entity after db retrieval
   */
  public static reconstruct(result: {
    id: string;
    title: string;
    description: string;
    active: boolean;
  }) {
    const { id, title, description, active } = result;
    return new Course(new CourseId(id), title, description, active);
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  public updateTitle(newTitle: string) {
    this.validateTitle(newTitle);
    this._title = newTitle;
  }

  public updateDescription(newDescription: string) {
    this.validateDescription(newDescription);
    this._description = newDescription;
  }

  private validateDescription(description: string) {
    if (!description || description.trim().length < 10) {
      throw new Error(
        'Course description must be at least 10 characters long.'
      );
    }
  }

  private validateTitle(title: string) {
    if (!title || title.trim().length === 0) {
      throw new DomainException('Course title cannot be empty.');
    }
  }

  private validateCreationParams(title: string, description: string): void {
    if (!title || title.trim().length === 0) {
      throw new DomainException('Course title cannot be empty.');
    }
    // You could add description validation here too.
    if (!description || description.trim().length < 10) {
      throw new DomainException(
        'Course description must be at least 10 characters long.'
      );
    }
  }

  get id(): CourseId {
    return this._id;
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
