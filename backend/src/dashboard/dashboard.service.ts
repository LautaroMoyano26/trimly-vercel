import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Turno } from '../turnos/turno.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Producto } from '../producto/producto.entity';
import { Factura } from '../facturacion/factura.entity';
import { FacturaDetalle } from '../facturacion/factura-detalle.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Factura)
    private facturaRepository: Repository<Factura>,
    @InjectRepository(FacturaDetalle)
    private facturaDetalleRepository: Repository<FacturaDetalle>,
  ) {}

  async obtenerMetricasDashboard() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyStr = hoy.toISOString().split('T')[0];

    // Obtener inicio de semana (Domingo)
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    const inicioSemanaStr = inicioSemana.toISOString().split('T')[0];

    // Obtener fin de semana (Sábado)
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);
    const finSemanaStr = finSemana.toISOString().split('T')[0];

    // Obtener semana anterior para cálculo de crecimiento
    const inicioSemanaPrev = new Date(inicioSemana);
    inicioSemanaPrev.setDate(inicioSemana.getDate() - 7);
    const inicioSemanaPrevStr = inicioSemanaPrev.toISOString().split('T')[0];
    const finSemanaPrev = new Date(inicioSemana);
    finSemanaPrev.setDate(inicioSemana.getDate() - 1);
    const finSemanaPrevStr = finSemanaPrev.toISOString().split('T')[0];

    // Turnos de hoy
    const turnosHoy = await this.turnoRepository.find({
      where: { fecha: hoyStr },
      relations: ['servicio'],
    });

    // Filtrar turnos que no estén cancelados
    const turnosActivos = turnosHoy.filter((t) => t.estado !== 'cancelado');

    const totalTurnosHoy = turnosActivos.length;
    const turnosCompletados = turnosActivos.filter(
      (t) => t.estado === 'cobrado',
    ).length;
    const turnosPendientes = turnosActivos.filter(
      (t) => t.estado === 'pendiente',
    ).length;

    // Ingresos de hoy basados en facturas cobradas
    const facturasHoy = await this.facturaRepository.find({
      where: {
        estado: 'cobrada',
        createdAt: Between(hoy, new Date(hoy.getTime() + 24 * 60 * 60 * 1000)),
      },
      relations: ['detalles'],
    });

    const ingresosHoy = facturasHoy.reduce((total, factura) => {
      const totalFactura = factura.detalles.reduce(
        (sum, detalle) => sum + Number(detalle.subtotal),
        0,
      );
      return total + totalFactura;
    }, 0);

    // Objetivo diario (puede ser configurable)
    const objetivoDiario = 35000;
    const porcentajeCumplimiento = (ingresosHoy / objetivoDiario) * 100;

    // Clientes atendidos en la semana
    const facturasSemana = await this.facturaRepository.find({
      where: {
        estado: 'cobrada',
        createdAt: Between(inicioSemana, finSemana),
      },
    });

    // Clientes únicos atendidos (facturados) en la semana
    const clientesIdsAtendidos = [
      ...new Set(facturasSemana.map((f) => f.clienteId)),
    ];
    const clientesAtendidos = clientesIdsAtendidos.length;

    // Total de facturas en la semana
    const clientesFacturados = facturasSemana.length;

    // Resumen semanal
    const turnosSemana = await this.turnoRepository.find({
      where: {
        fecha: Between(inicioSemanaStr, finSemanaStr),
      },
      relations: ['servicio'],
    });

    const totalTurnosSemana = turnosSemana.length;

    // Ingresos semanales basados en facturas cobradas
    const facturasSemanaCobradas = await this.facturaRepository.find({
      where: {
        estado: 'cobrada',
        createdAt: Between(inicioSemana, finSemana),
      },
      relations: ['detalles'],
    });

    const ingresosSemana = facturasSemanaCobradas.reduce((total, factura) => {
      const totalFactura = factura.detalles.reduce(
        (sum, detalle) => sum + Number(detalle.subtotal),
        0,
      );
      return total + totalFactura;
    }, 0);

    // Contar servicios y productos facturados en la semana
    const detallesSemana = facturasSemanaCobradas.flatMap((f) => f.detalles);
    const cantidadServicios = detallesSemana
      .filter((d) => d.tipo_item === 'servicio')
      .reduce((sum, d) => sum + d.cantidad, 0);
    const cantidadProductos = detallesSemana
      .filter((d) => d.tipo_item === 'producto')
      .reduce((sum, d) => sum + d.cantidad, 0);

    // Calcular crecimiento semanal
    const turnosSemanaAnterior = await this.turnoRepository.find({
      where: {
        fecha: Between(inicioSemanaPrevStr, finSemanaPrevStr),
      },
      relations: ['servicio'],
    });

    const ingresosSemanaAnterior = turnosSemanaAnterior
      .filter((t) => t.estado === 'cobrado')
      .reduce((suma, t) => suma + (t.servicio?.precio || 0), 0);

    const crecimientoSemanal =
      ingresosSemanaAnterior > 0
        ? ((ingresosSemana - ingresosSemanaAnterior) / ingresosSemanaAnterior) *
          100
        : 0;

    return {
      turnosHoy: {
        total: totalTurnosHoy,
        completados: turnosCompletados,
        pendientes: turnosPendientes,
      },
      ingresosHoy: {
        monto: ingresosHoy,
        objetivo: objetivoDiario,
        porcentaje: Math.round(porcentajeCumplimiento),
      },
      clientesHoy: {
        total: clientesAtendidos,
        atendidos: clientesAtendidos,
        facturados: clientesFacturados,
      },
      resumenSemanal: {
        ingresos: ingresosSemana,
        turnos: totalTurnosSemana,
        servicios: cantidadServicios,
        productos: cantidadProductos,
        crecimiento: Math.round(crecimientoSemanal),
      },
    };
  }

  async obtenerProximosTurnos() {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0].slice(0, 5);

    // Calcular hora límite (1 hora antes)
    const horaLimite = new Date(hoy);
    horaLimite.setHours(horaLimite.getHours() - 1);
    const horaLimiteStr = horaLimite.toTimeString().split(' ')[0].slice(0, 5);

    const turnosHoy = await this.turnoRepository.find({
      where: { fecha: hoyStr },
      relations: ['cliente', 'servicio'],
      order: { hora: 'ASC' },
    });

    // Filtrar turnos no atendidos desde 1 hora antes
    const proximosTurnos = turnosHoy
      .filter((t) => {
        const estadoValido = t.estado === 'pendiente' || t.estado !== 'cobrado';
        const horaValida = t.hora >= horaLimiteStr;
        return estadoValido && horaValida;
      })
      .slice(0, 5); // Mostrar hasta 5 turnos

    return proximosTurnos.map((turno) => ({
      id: turno.id,
      cliente: {
        nombre: `${turno.cliente.nombre} ${turno.cliente.apellido}`,
      },
      servicio: turno.servicio?.servicio || 'Sin servicio',
      hora: turno.hora,
      estado: turno.estado,
    }));
  }

  async obtenerNotificaciones() {
    const productosStockBajo = await this.productoRepository.find({
      where: {
      },
    });

    const productosCriticos = productosStockBajo
      .filter((p) => p.stock < 5)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        stock: p.stock,
      }));

    // Servicios sin pagar (turnos con estado pendiente que ya pasaron)
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];

    const turnosSinPagar = await this.turnoRepository.find({
      where: { estado: 'pendiente' },
      relations: ['cliente', 'servicio'],
      order: { fecha: 'DESC' },
    });

    // Filtrar turnos que están en el pasado
    const serviciosSinPagar = turnosSinPagar
      .filter((t) => t.fecha < hoyStr)
      .map((turno) => {
        const fechaTurno = new Date(turno.fecha);
        const diferenciaHora = Math.abs(hoy.getTime() - fechaTurno.getTime());
        const diferenciaDias = Math.ceil(diferenciaHora / (1000 * 60 * 60 * 24));

        let fechaRelativa = '';
        if (diferenciaDias === 0) {
          fechaRelativa = 'hoy';
        } else if (diferenciaDias === 1) {
          fechaRelativa = 'ayer';
        } else {
          fechaRelativa = `hace ${diferenciaDias} días`;
        }

        return {
          id: turno.id,
          cliente: `${turno.cliente.nombre} ${turno.cliente.apellido}`,
          monto: turno.servicio?.precio || 0,
          fecha: turno.fecha,
          fechaRelativa,
        };
      });

    return {
      stockBajo: {
        cantidad: productosCriticos.length,
        productos: productosCriticos,
      },
      serviciosSinPagar: {
        cantidad: serviciosSinPagar.length,
        servicios: serviciosSinPagar,
      },
    };
  }
}
