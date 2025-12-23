import { DomainException } from '../../../../src/common/exceptions/domain.exception';

export class Email {
  constructor(private readonly email: string) {
    if (!this.isValid(email)) {
      throw new DomainException('Invalid email provided!');
    }
  }

  private isValid(email: string): boolean {
    if (!email) {
      return false;
    }

    return email.includes('@');
  }

  get value() {
    return this.email;
  }
}
