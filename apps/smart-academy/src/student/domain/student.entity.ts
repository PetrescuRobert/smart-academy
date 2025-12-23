import { DomainException } from '../../common/exceptions/domain.exception';
import { Email } from './value-objects/email.vo';
import { StudentId } from './value-objects/student-id.vo';

export class Student {
  constructor(
    private readonly id: StudentId,
    private firstName: string,
    private lastName: string,
    private email: Email,
    private profilePicture: string
  ) {
    this.validateRequiredEmail(email);
    this.validateNonEmptyStudentFirstName(firstName);
    this.validateNonEmptyStudentLastName(lastName);
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePicture = profilePicture;
  }

  private validateRequiredEmail(email: Email) {
    if (!email) {
      throw new DomainException('Email is required when creating a student!');
    }
  }

  private validateNonEmptyStudentFirstName(firstName: string) {
    if (!firstName || firstName.trim().length === 0) {
      throw new DomainException('First name must be defined');
    }
  }

  private validateNonEmptyStudentLastName(lastName: string) {
    if (!lastName || lastName.trim().length === 0) {
      throw new DomainException('Last name must be defined');
    }
  }

  updateEmail(email: Email) {
    this.validateRequiredEmail(email);
    this.email = email;
  }

  updateFirstName(firstName: string) {
    this.validateNonEmptyStudentFirstName(firstName);
    this.firstName = firstName;
  }

  updateLastName(lastName: string) {
    this.validateNonEmptyStudentLastName(lastName);
    this.lastName = lastName;
  }

  updateProfilePicture(profilePicture: string) {
    this.profilePicture = profilePicture;
  }

  get getId() {
    return this.id;
  }

  get getFirstName() {
    return this.firstName;
  }

  get getLastName() {
    return this.lastName;
  }

  get getEmail() {
    return this.email;
  }

  get getProfilePicture() {
    return this.profilePicture;
  }

  equals(other: Student) {
    return other instanceof Student && this.id.value === other.id.value;
  }
}
