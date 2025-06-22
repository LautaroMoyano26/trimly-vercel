import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateServicioDto {
  @IsString()
  @IsOptional()
  servicio?: string; // Cambia 'nombre' por 'servicio'

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  duracion?: string;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean; // Cambia 'activo' por 'estado'
}