import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import useSwaggerUIAuthStoragePlugin from './core/utils/swagger_plugin';
import { json } from 'express';
import { urlencoded } from 'body-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/');
  const options = new DocumentBuilder()
    .setTitle('VIRTUO SERVICES API DOCUMENTATION')
    .setDescription('API endpoints for VIRTUO portal')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get('port');

  //const prismaService: PrismaService = app.get(PrismaService);
  //prismaService.enableShutdownHooks(app);

  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();
