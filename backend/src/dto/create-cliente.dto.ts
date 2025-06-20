// src/clientes/dto/create-cliente.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail() // Valida que sea un formato de email válido
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsDateString() // Valida que sea una cadena de fecha válida (ej. 'YYYY-MM-DD')
  @IsOptional() // Porque en tu entidad es nullable: true
  fechaNacimiento?: string;

  @IsBoolean()
  @IsOptional() // Porque tiene un default: true en la entidad
  activo?: boolean;
}
