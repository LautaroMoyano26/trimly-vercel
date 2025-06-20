import { Controller, Get, Post, Body} from '@nestjs/common';
import { ServicioService } from './servicios.service';
import { Servicio } from './servicio.entity';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly ServicioService: ServicioService) {}

  @Get()
  findAll(): Promise<Servicio[]> {
    return this.ServicioService.findAll();
  }

  @Post()
  create(@Body() servicio: Partial<Servicio>) {
    return this.ServicioService.create(servicio);
  }
}
