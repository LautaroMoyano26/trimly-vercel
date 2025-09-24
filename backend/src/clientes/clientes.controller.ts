// src/clientes/clientes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Cliente } from './cliente.entity'; // Asegúrate de que esta entidad exista y esté definida
import { CreateClienteDto } from '../dto/create-cliente.dto'; // Asegúrate de que este DTO exista
import { UpdateClienteDto } from '../dto/update-cliente.dto'; // Asegúrate de que este DTO exista

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @Post()
  // Es muy recomendable usar el DTO de creación aquí también para validación
  create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(createClienteDto);
  }

  @Patch(':id') // <--- Esta es la ruta para la edición
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    // Convierte el ID de string a number, ya que el servicio lo espera como number
    const clienteActualizado = await this.clientesService.update(
      +id,
      updateClienteDto,
    );
    if (!clienteActualizado) {
      // Si el servicio devuelve undefined (cliente no encontrado), lanza una excepción HTTP 404
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }
    return clienteActualizado; // Retorna el cliente actualizado
  }
}
