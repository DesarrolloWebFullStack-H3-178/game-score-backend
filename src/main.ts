import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Game Score Manager API')
    .setDescription(`
      The Score Management System project is a full-stack web application 
      that allows players to manage and display scores for an online video game. 
      Players will be able to register on the platform, log in, and their scores will be 
      automatically recorded when they play. The highest scores will be displayed in a global ranking. 
      Administrators will be able to manage the scores and user content from an administration panel.
      `)
    .setVersion('1.3.9')
    .build();

  // Enable CORS
  app.enableCors({
    origin: 'https://game-score-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableVersioning().setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
