import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './turno.entity';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Cliente, Servicio])],
  providers: [TurnosService],
  controllers: [TurnosController],
})
export class TurnosModule {}