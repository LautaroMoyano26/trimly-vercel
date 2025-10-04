import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';

@Injectable()
export class HistorialTurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepo: Repository<Turno>,
  ) {}

  // Devuelve todos los turnos con cliente, servicio, usuario y factura
  async obtenerTurnos() {
    return this.turnoRepo.find({
      relations: ['cliente', 'servicio', 'usuario', 'factura'],
      order: { fecha: 'DESC' },
    });
  }

  // Si en algún momento querés turnos solo de un día específico
  async obtenerTurnosPorFecha(fecha: string) {
    return this.turnoRepo.find({
      where: { fecha },
      relations: ['cliente', 'servicio', 'usuario', 'factura'],
      order: { hora: 'DESC' },
    });
  }
}
