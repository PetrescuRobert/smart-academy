export class StudentId {
  constructor(private readonly id: string) {}

  get value(): string {
    return this.id;
  }

  equals(other: StudentId): boolean {
    return other instanceof StudentId && other.value === this.value;
  }
}
