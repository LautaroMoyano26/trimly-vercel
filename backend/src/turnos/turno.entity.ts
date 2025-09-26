import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';
import { TurnoProducto } from './turno-producto.entity';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column({ nullable: true })
  servicioId: number;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'cobrado' | 'cancelado';

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @ManyToOne(() => Servicio, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @OneToMany(() => TurnoProducto, (turnoProducto: TurnoProducto) => turnoProducto.turno, { eager: true })
  productos: TurnoProducto[];
}