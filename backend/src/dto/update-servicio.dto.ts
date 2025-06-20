import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateServicioDto {
  @IsString()
  @IsOptional()
  servicio?: string; // Cambia 'nombre' por 'servicio'

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  duracion?: number;

  @IsNumber()
  @IsOptional()
  precio?: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean; // Cambia 'activo' por 'estado'
}