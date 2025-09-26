import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';
import { Turno } from './turno.entity';
import { TurnoProducto } from './turno-producto.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';
import { Producto } from '../producto/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, TurnoProducto, Cliente, Servicio, Producto]),
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}