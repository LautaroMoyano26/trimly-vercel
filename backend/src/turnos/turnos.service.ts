import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { CreateTurnoDto } from '../dto/create-turno.dto';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const cliente = await this.clienteRepository.findOneBy({ id: createTurnoDto.clienteId });
    const servicio = await this.servicioRepository.findOneBy({ id: createTurnoDto.servicioId });

    if (!cliente || !servicio) {
      throw new NotFoundException('Cliente o servicio no encontrado');
    }

    const turno = this.turnoRepository.create({
      cliente,
      servicio,
      fecha: createTurnoDto.fecha,
      hora: createTurnoDto.hora,
      notasAdicionales: createTurnoDto.notas,
    });

    return await this.turnoRepository.save(turno);
  }

  async findAll(): Promise<Turno[]> {
    return await this.turnoRepository.find({
      relations: ['cliente', 'servicio'],
    });
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findOne({
      where: { id },
      relations: ['cliente', 'servicio'],
    });
    if (!turno) {
      throw new NotFoundException(`Turno con id ${id} no encontrado`);
    }
    return turno;
  }

  async update(id: number, updateTurnoDto: Partial<CreateTurnoDto>): Promise<Turno> {
    await this.turnoRepository.update(id, updateTurnoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.turnoRepository.delete(id);
  }
}
