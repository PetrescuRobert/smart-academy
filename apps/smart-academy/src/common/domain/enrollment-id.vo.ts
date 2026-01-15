import { BaseId } from './base-id.abstract';

export class EnrollmentId extends BaseId {
  equals(id: EnrollmentId) {
    return this.value === id.value && id instanceof EnrollmentId;
  }
}
