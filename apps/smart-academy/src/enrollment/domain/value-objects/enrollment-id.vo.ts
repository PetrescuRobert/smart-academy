export class EnrollmentId {
  constructor(public readonly id: string) {}

  equals(eId: EnrollmentId) {
    return this.id === eId.id && eId instanceof EnrollmentId;
  }
}
