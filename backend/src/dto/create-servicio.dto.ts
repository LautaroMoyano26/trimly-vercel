import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  duracion: number; // minutos

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}