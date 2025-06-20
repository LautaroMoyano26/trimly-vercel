// src/clientes/clientes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity'; // Asegúrate de que esta entidad exista y esté definida
import { CreateClienteDto } from '../dto/create-cliente.dto'; // Asegúrate de que este DTO exista y la ruta sea correcta
import { UpdateClienteDto } from '../dto/update-cliente.dto'; // Asegúrate de que este DTO exista y la ruta sea correcta

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const nuevoCliente = this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(nuevoCliente);
  }

  // --- ¡¡¡ESTE ES EL MÉTODO QUE NECESITAS ASEGURAR EN ESTE ARCHIVO!!! ---
  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente | undefined> {
    // 'preload' busca una entidad por ID y aplica los cambios del DTO.
    // Retorna la entidad con los cambios aplicados, pero aún no guardados.
    const cliente = await this.clientesRepository.preload({
      id: id,
      ...updateClienteDto,
    });

    if (!cliente) {
      // Si preload no encuentra un cliente con ese ID, devuelve undefined
      return undefined;
    }

    // Si se encontró el cliente, guarda los cambios en la base de datos
    return this.clientesRepository.save(cliente);
  }

  // Opcional: un método para encontrar un cliente por ID si lo necesitas en otro lugar
  findOne(id: number): Promise<Cliente | null> {
    return this.clientesRepository.findOne({ where: { id } });
  }
}
