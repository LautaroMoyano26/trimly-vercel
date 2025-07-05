import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  findOne(id: number): Promise<Producto | null> {
    return this.productoRepository.findOneBy({ id });
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
