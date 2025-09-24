import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './turno.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';
import { Usuario } from '../usuarios/usuario.entity'; 
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Cliente, Servicio, Usuario]) 
  ],
  providers: [TurnosService],
  controllers: [TurnosController],
  exports: [TurnosService],
})
export class TurnosModule {}