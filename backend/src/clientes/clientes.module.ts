import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Cliente } from './cliente.entity';
import { Turno } from '../turnos/turno.entity';
import { Factura } from '../facturacion/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Turno, Factura])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
