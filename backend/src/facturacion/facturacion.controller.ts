import { Controller, Post, Body } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller('facturacion')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post('finalizar')
  async finalizarFactura(@Body() dto: CreateFacturaDto) {
    return await this.facturacionService.finalizarFactura(dto);
  }
}
