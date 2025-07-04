import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async validateUser(loginDto: LoginDto): Promise<Usuario | null> {
    const usuario = await this.usuariosRepository.findOne({
      where: { 
        username: loginDto.username, 
        password: loginDto.password,
        activo: true 
      }
    });

    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { id } });
  }
}