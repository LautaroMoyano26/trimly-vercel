import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}