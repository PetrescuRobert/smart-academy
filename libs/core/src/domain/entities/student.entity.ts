import { BaseEntity } from '../abstract/base.entity.js';
import { StudentId } from '../value-objects/student-id.vo.js';

export class Student extends BaseEntity<StudentId> {
  private _firstName: string;
  private _lastName: string;
  private _email: string;

  private constructor(
    id: StudentId,
    firstName: string,
    lastName: string,
    email: string
  ) {
    super(id);
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
  }

  public static create(
    id: StudentId,
    firstName: string,
    lastName: string,
    email: string
  ): Student {
    Student.validateCreationParams(firstName, lastName, email);

    return new Student(id, firstName, lastName, email);
  }

  private static validateCreationParams(
    firstName: string,
    lastName: string,
    email: string
  ): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty.');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty.');
    }

    const normalized = (email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalized || !emailRegex.test(normalized)) {
      throw new Error('Email is invalid.');
    }
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }
}
