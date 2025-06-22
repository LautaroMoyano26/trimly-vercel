import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  servicio: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  duracion: number;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}