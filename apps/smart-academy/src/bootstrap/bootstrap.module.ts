import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from '../common/application-bootstrap-options';
import { DrizzleModule } from '../common/drizzle/drizzle.module';
import { DATA_SOURCE } from '../common/database/constants';
import { schema } from '../common/database/schema';

@Module({})
export class BootstrapModule {
  static forRoot(options: ApplicationBootstrapOptions): DynamicModule {
    const imports =
      options.driver === 'drizzle'
        ? [DrizzleModule.forRoot({ name: DATA_SOURCE, schema: schema })]
        : [];
    return {
      module: BootstrapModule,
      imports,
    };
  }
}
