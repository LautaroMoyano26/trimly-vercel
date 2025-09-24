import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Factura } from '../facturacion/factura.entity';
import { FacturaDetalle } from '../facturacion/factura-detalle.entity';
import { Producto } from '../producto/producto.entity';
import { Servicio } from '../servicios/servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura,
      FacturaDetalle,
      Producto,
      Servicio,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}