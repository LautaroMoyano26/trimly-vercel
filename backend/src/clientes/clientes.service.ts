import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  create(cliente: Partial<Cliente>) {
    const nuevoCliente = this.clientesRepository.create(cliente);
    return this.clientesRepository.save(nuevoCliente);
  }
}