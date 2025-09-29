import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Turno } from './turno.entity';
import { Producto } from '../producto/producto.entity';

@Entity()
export class TurnoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  turnoId: number;

  @Column()
  productoId: number;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @ManyToOne(() => Turno, turno => turno.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turnoId' })
  turno: Turno;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}