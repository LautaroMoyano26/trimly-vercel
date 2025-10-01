import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async obtenerMetricas() {
    return this.dashboardService.obtenerMetricasDashboard();
  }

  @Get('upcoming-turnos')
  async obtenerProximosTurnos() {
    return this.dashboardService.obtenerProximosTurnos();
  }

  @Get('notifications')
  async obtenerNotificaciones() {
    return this.dashboardService.obtenerNotificaciones();
  }
}
