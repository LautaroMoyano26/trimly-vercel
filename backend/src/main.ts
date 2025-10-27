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

  // Habilitar CORS para producción
  const frontendUrl = process.env.FRONTEND_URL || 'https://trimly-frontend-eta.vercel.app';
  
  console.log('🔧 Configurando CORS...');
  console.log('Frontend URL permitida:', frontendUrl);
  console.log('Environment:', process.env.NODE_ENV);
  
  app.enableCors({
    origin: (origin, callback) => {
      console.log('🌐 Origin recibido:', origin);
      
      // Permitir requests sin origin (como Postman, curl, etc)
      if (!origin) {
        console.log('✅ Permitido: Sin origin');
        return callback(null, true);
      }
      
      // Lista de origenes permitidos
      const allowedOrigins = [
        frontendUrl,
        'https://trimly-frontend-eta.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
      ];
      
      const isAllowed = allowedOrigins.some(allowed => 
        origin === allowed || origin === allowed + '/' || origin.startsWith(allowed)
      );
      
      if (isAllowed) {
        console.log('✅ CORS permitido para:', origin);
        callback(null, true);
      } else {
        console.log('❌ CORS bloqueado para:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 horas
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
