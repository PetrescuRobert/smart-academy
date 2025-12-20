export class CourseId {
  /**
   *
   */
  constructor(readonly value: string | null) {}

  public equals(id: CourseId) {
    return id.value === this.value;
  }
}
