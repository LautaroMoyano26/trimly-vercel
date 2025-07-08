import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { password, ...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuariosRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usuariosRepository.save(nuevoUsuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      order: {
        activo: 'DESC',
        nombre: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    // Si se proporciona una nueva contraseña, hashearla
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        10,
      );
    }

    const usuario = await this.usuariosRepository.preload({
      id: id,
      ...updateUsuarioDto,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    return this.usuariosRepository.save(usuario);
  }

  async checkUsername(username: string): Promise<{ exists: boolean }> {
    const count = await this.usuariosRepository.count({ where: { username } });
    return { exists: count > 0 };
  }
}
