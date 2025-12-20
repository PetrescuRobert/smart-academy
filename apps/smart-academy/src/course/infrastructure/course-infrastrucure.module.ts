import { Module } from '@nestjs/common';
import { DrizzlePersistanceModule } from './persistance/drizzle/drizzle-persistance.module';
import { InMemoryPersistanceModule } from './persistance/in-memory/in-memory-persistance.module';

@Module({})
export class CourseInfrastructureModule {
  static use(driver: 'drizzle' | 'in-memory') {
    const persistanceModule =
      driver === 'drizzle'
        ? DrizzlePersistanceModule
        : InMemoryPersistanceModule;

    return {
      module: CourseInfrastructureModule,
      imports: [persistanceModule],
      exports: [persistanceModule],
    };
  }
}
