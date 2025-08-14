import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from '../dto/create-turno.dto';
import { UpdateTurnoDto } from '../dto/update-turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    try {
      return await this.turnosService.update(+id, updateTurnoDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update turno: ${error.message}`);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }
}
