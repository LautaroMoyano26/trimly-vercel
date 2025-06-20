import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './servicio.entity';
import { ServicioService } from './servicios.service';
import { ServiciosController } from './servicios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  providers: [ServicioService],
  controllers: [ServiciosController],
})
export class ServiciosModule {}