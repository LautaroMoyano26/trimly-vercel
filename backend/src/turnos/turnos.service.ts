import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { TurnoProducto } from './turno-producto.entity';
import { CreateTurnoDto } from '../dto/create-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(TurnoProducto)
    private turnoProductoRepository: Repository<TurnoProducto>,
  ) {}

  async findAll(): Promise<Turno[]> {
    return this.turnoRepository.find({
      relations: ['cliente', 'servicio', 'productos', 'productos.producto'],
    });
  }

  async findOne(id: number): Promise<Turno | null> {
    return this.turnoRepository.findOne({
      where: { id },
      relations: ['cliente', 'servicio', 'productos', 'productos.producto'],
    });
  }

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const turno = this.turnoRepository.create({
      clienteId: createTurnoDto.clienteId,
      servicioId: createTurnoDto.servicioId,
      fecha: createTurnoDto.fecha,
      hora: createTurnoDto.hora,
      notas: createTurnoDto.notas,
    });

    const turnoGuardado = await this.turnoRepository.save(turno);

    // Si hay productos, crearlos
    if (createTurnoDto.productos && createTurnoDto.productos.length > 0) {
      const turnoProductos = createTurnoDto.productos.map(producto =>
        this.turnoProductoRepository.create({
          turnoId: turnoGuardado.id,
          productoId: producto.productoId,
          cantidad: producto.cantidad,
          precioUnitario: producto.precioUnitario,
        })
      );
      await this.turnoProductoRepository.save(turnoProductos);
    }

    // Retornar el turno completo con relaciones
    const turnoCompleto = await this.findOne(turnoGuardado.id);
    if (!turnoCompleto) {
      throw new Error('Turno no encontrado después de crearlo');
    }
    return turnoCompleto;
  }

  async findByEstado(estado: string): Promise<Turno[]> {
    return this.turnoRepository.find({
      where: { estado: estado as any },
      relations: ['cliente', 'servicio', 'productos', 'productos.producto'],
    });
  }

  async update(id: number, updateData: Partial<Turno>): Promise<Turno | null> {
    await this.turnoRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.turnoRepository.delete(id);
  }
}