import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';

// Option 1: Extend PartialType (recommended NestJS approach)
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}

// OR Option 2: Define all fields as optional
/*
export class UpdateTurnoDto {
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  servicioId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;
  
  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
*/
