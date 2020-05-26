import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

/**
 * Boots up the APIs
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //Cors setting to allow cross-site requests only from given frontend
  app.enableCors({
    origin: configService.get<string>('FRONTEND'),
    credentials: true,
  });
  // Security Headers
  app.use(helmet());
  // limit each IP to 100 requests per minute
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  // Setup Swagger for API docs
  const options = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription(
      `Task Management API route and DTO definitions. Follows OpenAPI 3.0`,
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('tasks')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  // Start server
  await app.listen(configService.get('PORT') || 3000);
}

bootstrap();
