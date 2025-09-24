import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from './usuario.entity';

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

  @Get('check-username/:username')
  async checkUsername(@Param('username') username: string) {
    return this.usuariosService.checkUsername(username);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuarioActualizado = await this.usuariosService.update(
      +id,
      updateUsuarioDto,
    );
    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return usuarioActualizado;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // La lógica de login se moverá al servicio para mantener el controlador limpio.
    // Por ahora, se deja como placeholder.
    throw new BadRequestException(
      'La funcionalidad de login no está completamente implementada en el controlador.',
    );
  }
}
