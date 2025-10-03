import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Servicio } from '../servicios/servicio.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { TurnoProducto } from './turno-producto.entity';
import { Factura } from '../facturacion/factura.entity';
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

  @ManyToOne(() => Servicio, { eager: true, onDelete: 'SET NULL' }) // <- cambio aquí
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;

  @ManyToOne(() => Usuario, usuario => usuario.turnos, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'usuarioId' })
usuario: Usuario | null; // debe incluir explícitamente null

  
  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @OneToMany(() => TurnoProducto, turnoProducto => turnoProducto.turno, { cascade: true })
  productos: TurnoProducto[];

 @OneToOne(() => Factura, (factura) => factura.turno)
@JoinColumn() 
factura: Factura;
}