// Archivo: backend/src/clientes/historial-cliente.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistorialClienteService } from './historial-cliente.service';
@Controller('clientes')
export class HistorialClienteController {
  constructor(private historialClienteService: HistorialClienteService) {}

  @Get(':id/turnos')
  async obtenerTurnosCliente(@Param('id', ParseIntPipe) clienteId: number) {
    return this.historialClienteService.obtenerTurnosCliente(clienteId);
  }

  @Get(':id/facturas')
  async obtenerFacturasCliente(@Param('id', ParseIntPipe) clienteId: number) {
    return this.historialClienteService.obtenerFacturasCliente(clienteId);
  }
}
