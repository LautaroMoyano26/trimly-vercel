import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Turno } from '../turnos/turno.entity';
import { TurnoProducto } from '../turnos/turno-producto.entity';
import { Factura } from '../facturacion/factura.entity';
import { FacturaDetalle } from '../facturacion/factura-detalle.entity';
import { Servicio } from '../servicios/servicio.entity';
import { Producto } from '../producto/producto.entity';
import { Cliente } from '../clientes/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Turno, 
      TurnoProducto, 
      Cliente, 
      Factura, 
      FacturaDetalle, 
      Servicio, 
      Producto
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}