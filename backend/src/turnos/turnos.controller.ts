import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from '../dto/create-turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  @Get()
  async findAll() {
    const turnos = await this.turnosService.findAll();
    
    return turnos.map(turno => ({
      ...turno,
      productos: turno.productos?.map(tp => ({
        id: tp.productoId,
        nombre: tp.producto?.nombre || 'Producto desconocido',
        precio: tp.precioUnitario,
        cantidad: tp.cantidad
      })) || []
    }));
  }

  @Get('con-productos')
async findTurnosConProductos() {
  const turnos = await this.turnosService.findAll();
  
  return turnos.map(turno => ({
    id: turno.id,
    clienteId: turno.clienteId,
    servicioId: turno.servicioId,
    fecha: turno.fecha,
    estado: turno.estado,
    cliente: turno.cliente,
    servicio: turno.servicio,
    productos: turno.productos?.map(tp => ({
      id: tp.productoId,
      nombre: tp.producto?.nombre || 'Producto desconocido',
      precio: Number(tp.precioUnitario),
      cantidad: tp.cantidad
    })) || []
  }));
}

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.turnosService.findByEstado(estado);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const turno = await this.turnosService.findOne(+id);
    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return turno;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() body: { estado: 'pendiente' | 'cobrado' | 'cancelado' }
  ) {
    const turno = await this.turnosService.update(+id, { estado: body.estado });
    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return turno;
  }
}