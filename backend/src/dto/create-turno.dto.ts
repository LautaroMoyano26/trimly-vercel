import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTurnoDto {
  @IsNumber()
  clienteId: number;

  @IsNumber()
  servicioId: number;

  @IsDateString()
  fecha: string;
  
  @IsString()
  hora: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
