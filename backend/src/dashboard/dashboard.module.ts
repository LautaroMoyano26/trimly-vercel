import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Turno } from '../turnos/turno.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Producto } from '../producto/producto.entity';
import { Factura } from '../facturacion/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Cliente, Producto, Factura])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
