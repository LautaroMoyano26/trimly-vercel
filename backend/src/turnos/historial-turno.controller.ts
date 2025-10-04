import { Controller, Get, Query } from '@nestjs/common';
import { HistorialTurnosService } from './historial-turno.service';

@Controller('turno') // <-- mantiene la ruta que ya usas en React
export class HistorialTurnosController {
  constructor(private readonly historialTurnosService: HistorialTurnosService) {}

  // GET /turnos
  @Get()
  async obtenerTurnos(@Query('fecha') fecha?: string) {
    if (fecha) {
      return this.historialTurnosService.obtenerTurnosPorFecha(fecha);
    }
    return this.historialTurnosService.obtenerTurnos();
  }
}
