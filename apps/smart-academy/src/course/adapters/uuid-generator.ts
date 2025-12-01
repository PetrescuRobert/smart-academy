import { Injectable } from '@nestjs/common';
import { UuidGenerator } from '@smart-academy/core';
import { randomUUID } from 'crypto';

@Injectable()
export class UuidGeneratorImpl implements UuidGenerator {
  generate(): string {
    // TODO: update to UUID v7
    return randomUUID();
  }
}
