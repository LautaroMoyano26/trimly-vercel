import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturacionController } from './facturacion.controller';
import { FacturacionService } from './facturacion.service';
import { Factura } from './factura.entity';
import { FacturaDetalle } from './factura-detalle.entity';
import { Turno } from '../turnos/turno.entity';
import { Producto } from '../producto/producto.entity';
import { Servicio } from '../servicios/servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura,
      FacturaDetalle,
      Turno,
      Producto,
      Servicio,
    ]),
  ],
  controllers: [FacturacionController],
  providers: [FacturacionService],
})
export class FacturacionModule {}
