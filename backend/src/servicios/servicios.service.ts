// backend/src/servicios/servicios.service.ts - CORREGIR
import { Injectable, NotFoundException } from '@nestjs/common'; // ✅ AGREGAR NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Servicio } from './servicio.entity';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private ServicioRepository: Repository<Servicio>,
  ) {}

  async findAll(): Promise<Servicio[]> {
    return this.ServicioRepository.find({
      order: {
        servicio: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.ServicioRepository.findOneBy({ id });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return servicio;
  }

  async findActivos(): Promise<Servicio[]> {
    return this.ServicioRepository.find({
      where: { estado: true },
      order: {
        servicio: 'ASC'
      }
    });
  }

  create(servicio: Partial<Servicio>) {
    const nuevoServicio = this.ServicioRepository.create(servicio);
    return this.ServicioRepository.save(nuevoServicio);
  }

  async update(id: number, servicio: Partial<Servicio>) {
    await this.ServicioRepository.update(id, servicio);
    return this.ServicioRepository.findOneBy({ id });
  }

  // ✅ CORREGIR MÉTODO REMOVE
  async remove(id: number): Promise<void> {
    const servicio = await this.ServicioRepository.findOneBy({ id });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    await this.ServicioRepository.delete(id);
  }

  // ✅ ELIMINAR MÉTODO DUPLICADO - MANTENER SOLO UNO
  buscarPorNombre(nombre: string): Promise<Servicio[]> {
    return this.ServicioRepository.find({
      where: { servicio: Like(`%${nombre}%`) },
    });
  }
}