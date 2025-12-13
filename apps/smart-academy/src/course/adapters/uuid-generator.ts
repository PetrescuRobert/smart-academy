import { Inject, Injectable, Logger } from '@nestjs/common';
import { UuidGenerator } from '@smart-academy/core';
import { sql } from 'drizzle-orm';
import { DRIZZLE, PostgresDatabase } from '../../drizzle/types';

@Injectable()
export class UuidGeneratorImpl implements UuidGenerator {
  private readonly logger = new Logger(UuidGeneratorImpl.name);
  constructor(@Inject(DRIZZLE) private readonly db: PostgresDatabase) {}

  generate(): string {
    // TODO: update to UUID v7
    let generatedPostgresUuid = null;

    try {
      const rawResult = this.db.execute(sql`select uuidv7() as id`);
      generatedPostgresUuid = rawResult[0].id;
    } catch (e) {
      this.logger.error('Failed to generate UUID from Postgres!', e);
    }

    return generatedPostgresUuid;
  }
}
