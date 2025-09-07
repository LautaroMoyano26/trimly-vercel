import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Producto } from './producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async findDisponibles(): Promise<Producto[]> {
    return this.productoRepository.find({
      where: {
        stock: MoreThan(0), // Solo productos con stock mayor a 0
      },
      order: {
        nombre: 'ASC', // Ordenados alfabéticamente
      },
    });
  }

  create(producto: Partial<Producto>) {
    const nuevoProducto = this.productoRepository.create(producto);
    return this.productoRepository.save(nuevoProducto);
  }

  async update(id: number, producto: Partial<Producto>) {
    await this.productoRepository.update(id, producto);
    return this.productoRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }

  buscarPorNombre(nombre: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { nombre: Like(`%${nombre}%`) },
    });
  }
}
