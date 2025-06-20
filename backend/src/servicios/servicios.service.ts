import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  create(servicio: Partial<Servicio>) {
    const nuevoServicio = this.ServicioRepository.create(servicio);
    return this.ServicioRepository.save(nuevoServicio);
  }
}
