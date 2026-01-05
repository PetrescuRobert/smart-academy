import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzleModuleOptions } from './drizzle.interfaces';

export const {
  ConfigurableModuleClass: DrizzleConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: DRIZZLE_MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzleModuleOptions>()
  .setClassMethodName('forRoot')
  .setExtras({ isGlobal: true }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .build();
