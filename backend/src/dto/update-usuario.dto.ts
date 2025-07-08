import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsBoolean,
  IsIn,
  ValidateIf,
} from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7, { message: 'La contraseña debe tener al menos 7 caracteres.' })
  @ValidateIf((o) => o.password !== '') // Solo valida si no es un string vacío
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'empleado'], {
    message: 'El rol debe ser "admin" o "empleado".',
  })
  rol?: 'admin' | 'empleado';

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
