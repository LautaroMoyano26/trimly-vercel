import { IsOptional, IsArray, ValidateNested, IsInt, IsNumber, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTurnoProductoDto {
  @Type(() => Number)
  @IsInt()
  productoId: number;

  @Type(() => Number)
  @IsInt()
  cantidad: number;

  @Type(() => Number)
  @IsNumber()
  precioUnitario: number;
}

export class CreateTurnoDto {
  @Type(() => Number)
  @IsInt()
  clienteId: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  servicioId?: number;

  @IsDateString()
  fecha: string;

  @IsString()
  hora: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTurnoProductoDto)
  productos?: CreateTurnoProductoDto[];
}
