import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Producto } from './producto.entity';

@Injectable()
export class ProductoService implements OnModuleInit {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async onModuleInit() {
    await this.setAutoIncrementStart();
  }

  private async setAutoIncrementStart(): Promise<void> {
    try {
      // Verificar si ya existe algún producto con ID >= 10000
      const existingProducto = await this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.id >= :startId', { startId: 10000 })
        .getOne();

      // Solo configurar el AUTO_INCREMENT si no hay productos con ID >= 10000
      if (!existingProducto) {
        await this.productoRepository.query(
          'ALTER TABLE producto AUTO_INCREMENT = 10000'
        );
        console.log('AUTO_INCREMENT configurado para iniciar desde 10000');
      }
    } catch (error) {
      console.error('Error configurando AUTO_INCREMENT:', error);
    }
  }

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
