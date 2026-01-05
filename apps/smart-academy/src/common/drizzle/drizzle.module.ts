import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DataSource, DrizzleModuleOptions } from './drizzle.interfaces';
import { DrizzleLogger } from './drizzle.logger';
import {
  DRIZZLE_MODULE_OPTIONS_TOKEN,
  DrizzleConfigurableModuleClass,
  OPTIONS_TYPE,
} from './drizzle.module-definition';

@Global()
@Module({})
export class DrizzleModule extends DrizzleConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const root = super.forRoot(options);
    return {
      ...root,
      providers: [
        ...root.providers,
        {
          provide: options.name,
          useFactory: (
            configService: ConfigService,
            options: DrizzleModuleOptions
          ) => {
            const connectionString = configService.get<string>('DATABASE_URL');

            // TODO: validate connection string in config file, not here
            if (!connectionString) {
              throw new Error('DATABASE_URL must be defined in environment!');
            }

            const connectionsPool = new Pool({ connectionString });

            return drizzle(connectionsPool, {
              schema: options.schema,
              logger: new DrizzleLogger(),
            }) as DataSource<typeof options.schema>;
          },
          inject: [ConfigService, DRIZZLE_MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...(root.exports ?? []), options.name],
    };
  }
}
