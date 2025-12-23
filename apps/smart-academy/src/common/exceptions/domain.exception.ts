export class DomainException extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
