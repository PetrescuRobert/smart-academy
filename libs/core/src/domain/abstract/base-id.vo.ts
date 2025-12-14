export abstract class BaseId {
  value: string | null;

  constructor(value?: string | null) {
    this.value = value ?? null;
  }

  isEmpty(): boolean {
    return this.value === null || this.value === undefined || this.value === '';
  }
}
