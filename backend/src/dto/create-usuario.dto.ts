import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  ValidateIf, // Importar ValidateIf
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @ValidateIf((o) => o.email !== null && o.email !== '') // Solo valida si no es null o un string vacío
  email?: string;

  @IsEnum(['admin', 'empleado'])
  @IsNotEmpty({ message: 'El rol es obligatorio.' }) // El rol es obligatorio
  rol: 'admin' | 'empleado';
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
