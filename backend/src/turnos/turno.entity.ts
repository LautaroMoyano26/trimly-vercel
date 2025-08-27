import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column({ nullable: true })  
  servicioId: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @ManyToOne(() => Servicio, { eager: true, onDelete: 'SET NULL' }) // <- cambio aquí
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;
}
