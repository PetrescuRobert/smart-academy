import { Injectable, Logger } from '@nestjs/common';
import { Logger as BaseDrizzleLogger } from 'drizzle-orm/logger';

@Injectable()
export class DrizzleLogger implements BaseDrizzleLogger {
  private readonly logger = new Logger(DrizzleLogger.name);
  logQuery(query: string, params: unknown[]): void {
    this.logger.debug(`Query: ${query} -- Params:[${params}]`);
  }
}
