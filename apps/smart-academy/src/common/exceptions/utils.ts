import { DomainException } from './domain.exception';
import { PersistanceException } from './persistance.exception';

export function isPersistanceException(e: Error) {
  return e instanceof PersistanceException;
}

export function isDomainException(e: Error) {
  return e instanceof DomainException;
}
