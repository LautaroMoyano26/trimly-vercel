import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  dni: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: string;

  @Column({ default: true })
  activo: boolean;
}