import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Cliente } from './cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @Post()
  create(@Body() cliente: Partial<Cliente>) {
    return this.clientesService.create(cliente);
  }
}