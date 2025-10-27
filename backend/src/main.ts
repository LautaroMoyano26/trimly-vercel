// src/main.ts
import 'dotenv/config'; // Cargar variables de entorno ANTES de cualquier otra cosa
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Importa ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita el ValidationPipe globalmente para que los DTOs funcionen
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Esto eliminará propiedades que no estén en tus DTOs (buena práctica)
      forbidNonWhitelisted: true, // Esto lanzará un error si el frontend envía propiedades que no están en el DTO
      transform: true, // Esto transforma el payload de la request a una instancia de tu clase DTO
    }),
  );

  // Habilitar CORS dinámico
  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin === frontendUrl || origin === frontendUrl + '/') {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked'));
      }
    },
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
