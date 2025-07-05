import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.usuariosService.validateUser(loginDto);
    
    if (!usuario) {
      throw new BadRequestException('Credenciales inválidas');
    }

    return {
      id: usuario.id,
      username: usuario.username,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      message: 'Login exitoso'
    };
  }
}