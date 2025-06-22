import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  servicio: string;

  @Column()
  descripcion: string;

  @Column()
  duracion: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: true })
  estado: boolean;
}