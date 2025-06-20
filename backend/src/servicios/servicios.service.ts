import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Servicio } from './servicio.entity';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private ServicioRepository: Repository<Servicio>,
  ) {}

  findAll(): Promise<Servicio[]> {
    return this.ServicioRepository.find();
  }

  findOne(id: number): Promise<Servicio | null> {
    return this.ServicioRepository.findOneBy({ id });
  }

  create(servicio: Partial<Servicio>) {
    const nuevoServicio = this.ServicioRepository.create(servicio);
    return this.ServicioRepository.save(nuevoServicio);
  }

  async update(id: number, servicio: Partial<Servicio>) {
    await this.ServicioRepository.update(id, servicio);
    return this.ServicioRepository.findOneBy({ id });
  }

  buscarPorNombre(nombre: string): Promise<Servicio[]> {
    return this.ServicioRepository.find({
      where: { servicio: Like(`%${nombre}%`) },
    });
  }
}