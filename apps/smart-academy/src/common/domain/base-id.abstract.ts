export abstract class BaseId {
  constructor(public readonly value: string) {}
  abstract equals(id: BaseId): boolean;
}
