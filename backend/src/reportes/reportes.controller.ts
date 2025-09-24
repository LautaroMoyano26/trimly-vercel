import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

export class GenerarReporteDto {
  fechaInicio: string;
  fechaFin: string;
}

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post('generar')
  async generarReporte(@Body() dto: GenerarReporteDto) {
    return await this.reportesService.generarReporteCompleto(
      dto.fechaInicio,
      dto.fechaFin
    );
  }

  @Get('facturacion')
  async obtenerFacturacionPorPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return await this.reportesService.obtenerFacturacionPorPeriodo(
      fechaInicio,
      fechaFin
    );
  }

  @Get('servicios')
  async obtenerEstadisticasServicios(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.reportesService.obtenerEstadisticasServicios(
      fechaInicio,
      fechaFin
    );
  }

  @Get('productos')
  async obtenerEstadisticasProductos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.reportesService.obtenerEstadisticasProductos(
      fechaInicio,
      fechaFin
    );
  }
}