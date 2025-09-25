import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Turno } from '../turnos/turno.entity';
import { Factura } from '../facturacion/factura.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    @InjectRepository(Turno)
    private turnoRepo: Repository<Turno>,
    @InjectRepository(Factura)
    private facturaRepo: Repository<Factura>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clienteRepo.find();
  }

  create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const nuevoCliente = this.clienteRepo.create(createClienteDto);
    return this.clienteRepo.save(nuevoCliente);
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente | undefined> {
    const cliente = await this.clienteRepo.preload({
      id: id,
      ...updateClienteDto,
    });

    if (!cliente) {
      return undefined;
    }

    return this.clienteRepo.save(cliente);
  }

  findOne(id: number): Promise<Cliente | null> {
    return this.clienteRepo.findOne({ where: { id } });
  }

  async obtenerTurnosCliente(clienteId: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id: clienteId },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    return await this.turnoRepo.find({
      where: { clienteId },
      relations: ['servicio', 'usuario'],
      order: { fecha: 'DESC', hora: 'DESC' },
    });
  }

  async obtenerFacturasCliente(clienteId: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id: clienteId },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    return await this.facturaRepo.find({
      where: { clienteId },
      relations: ['detalles'],
      order: { createdAt: 'DESC' },
    });
  }
}
