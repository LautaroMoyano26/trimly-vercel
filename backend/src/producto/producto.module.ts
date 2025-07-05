import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],  // <-- Importar entidad
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
