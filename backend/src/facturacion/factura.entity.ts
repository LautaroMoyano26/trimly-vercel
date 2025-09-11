import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { FacturaDetalle } from './factura-detalle.entity';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @ManyToOne(() => Cliente)
  cliente: Cliente;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'cobrada' | 'cancelada';

  @Column()
  metodoPago: string;

  @OneToMany(
    () => FacturaDetalle,
    (detalle: FacturaDetalle) => detalle.factura,
    { cascade: true },
  )
  detalles: FacturaDetalle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
