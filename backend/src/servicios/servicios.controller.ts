import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { ServicioService } from './servicios.service';
import { Servicio } from './servicio.entity';
import { CreateServicioDto } from '../dto/create-servicio.dto';
import { UpdateServicioDto } from '../dto/update-servicio.dto'; // 1. Importa el DTO

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
  update(@Param('id') id: number, @Body() updateServicioDto: UpdateServicioDto) { // 2. Usa el DTO aquí
    return this.ServicioService.update(id, updateServicioDto);
  }

  @Get('buscar/nombre')
  buscarPorNombre(@Query('nombre') nombre: string): Promise<Servicio[]> {
    return this.ServicioService.buscarPorNombre(nombre);
  }
}