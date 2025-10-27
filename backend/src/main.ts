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
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, curl, etc)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verificar si el origin está en la lista de permitidos
      const isAllowed = allowedOrigins.some(allowed => 
        origin === allowed || origin === allowed + '/'
      );
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
