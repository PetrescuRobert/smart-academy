import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { DRIZZLE, PostgresDatabase } from './types';

@Global()
@Module({})
export class DrizzleModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DrizzleModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: DRIZZLE,
          useFactory: (configService: ConfigService) => {
            const connectionString = configService.get<string>('DATABASE_URL');

            // TODO: validate connection string in config file, not here
            if (!connectionString) {
              throw new Error('DATABASE_URL must be defined in environment!');
            }

            const connectionsPool = new Pool({ connectionString });

            return drizzle(connectionsPool, {
              schema,
              logger: true,
            }) as PostgresDatabase;
          },
          inject: [ConfigService],
        },
      ],
      exports: [DRIZZLE],
    };
  }
}
