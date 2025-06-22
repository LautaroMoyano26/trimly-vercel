// backend/src/servicios/servicios.controller.ts - CORREGIR
import { Controller, Get, Post, Body, Param, Put, Query, Delete } from '@nestjs/common'; // ✅ AGREGAR Delete
import { ServicioService } from './servicios.service';
import { Servicio } from './servicio.entity';
import { CreateServicioDto } from '../dto/create-servicio.dto';
import { UpdateServicioDto } from '../dto/update-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly ServicioService: ServicioService) {}

  @Get()
  findAll(): Promise<Servicio[]> {
    return this.ServicioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Servicio|null> {
    return this.ServicioService.findOne(id);
  }

  @Post()
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.ServicioService.create(createServicioDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateServicioDto: UpdateServicioDto) {
    return this.ServicioService.update(id, updateServicioDto);
  }

  // ✅ CORREGIR MÉTODO DELETE
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID inválido');
    }
    
    await this.ServicioService.remove(numericId);
    return { message: 'Servicio eliminado correctamente' };
  }

  // ✅ ELIMINAR MÉTODO DUPLICADO - MANTENER SOLO UNO
  @Get('buscar/nombre')
  buscarPorNombre(@Query('nombre') nombre: string): Promise<Servicio[]> {
    return this.ServicioService.buscarPorNombre(nombre);
  }
}