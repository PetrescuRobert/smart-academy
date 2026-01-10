/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstraps and starts the NestJS application with global configuration.
 *
 * Applies the ResponseInterceptor and a ValidationPipe configured to transform inputs,
 * strip unknown properties, and reject requests with non-whitelisted properties.
 * Registers Swagger UI at /api, sets the global route prefix to "api", and begins listening
 * on the port from `process.env.PORT` or 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({ driver: 'drizzle' })
  );

  /**
   * Apply custom interceptors
   */
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * Apply global pipes
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  /**
   * Swagger setup
   */
  const config = new DocumentBuilder()
    .setTitle('Smart Academy Api documentation')
    .setDescription('The smart academy api doc')
    .setVersion('1.0')
    .addTag('smart-academy')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();