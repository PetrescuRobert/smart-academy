import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from '../common/application-bootstrap-options';
import { DrizzlePersistanceModule } from '../course/infrastructure/persistance/drizzle/drizzle-persistance.module';

@Module({})
export class BootstrapModule {
  static forRoot(options: ApplicationBootstrapOptions): DynamicModule {
    const imports =
      options.driver === 'drizzle'
        ? [DrizzlePersistanceModule.forRootAsync()]
        : [];
    return {
      module: BootstrapModule,
      imports,
    };
  }
}
