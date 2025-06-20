// src/clientes/dto/update-cliente.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string; // Valida que sea un formato de email válido

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  fechaNacimiento?: string;

  @IsOptional()
  activo?: boolean;
}
