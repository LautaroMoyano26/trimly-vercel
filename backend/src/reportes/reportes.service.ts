import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from '../facturacion/factura.entity';
import { FacturaDetalle } from '../facturacion/factura-detalle.entity';
import { Producto } from '../producto/producto.entity';
import { Servicio } from '../servicios/servicio.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepo: Repository<Factura>,
    @InjectRepository(FacturaDetalle)
    private detalleRepo: Repository<FacturaDetalle>,
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
    @InjectRepository(Servicio)
    private servicioRepo: Repository<Servicio>,
  ) {}

  async generarReporteCompleto(fechaInicio: string, fechaFin: string) {
    try {
      // Obtener servicios con estadísticas
      const servicios = await this.servicioRepo
        .createQueryBuilder('s')
        .leftJoin('factura_detalle', 'fd', 's.id = fd.itemId AND fd.tipo_item = :tipoServicio', { tipoServicio: 'servicio' })
        .leftJoin('factura', 'f', 'fd.facturaId = f.id')
        .select([
          's.id',
          's.servicio as nombre',
          's.precio',
          's.duracion',
          's.estado as activo',
          'COALESCE(COUNT(DISTINCT fd.id), 0) as cantidadServicios',
          'COALESCE(SUM(fd.precioUnitario * fd.cantidad), 0) as ingresos'
        ])
        .where('s.estado = :estado', { estado: true })
        .andWhere('(f.createdAt IS NULL OR DATE(f.createdAt) BETWEEN :fechaInicio AND :fechaFin)', {
          fechaInicio,
          fechaFin
        })
        .groupBy('s.id, s.servicio, s.precio, s.duracion, s.estado')
        .orderBy('ingresos', 'DESC')
        .getRawMany();

      // Obtener productos con estadísticas
      const productos = await this.productoRepo
        .createQueryBuilder('p')
        .leftJoin('factura_detalle', 'fd', 'p.id = fd.itemId AND fd.tipo_item = :tipoProducto', { tipoProducto: 'producto' })
        .leftJoin('factura', 'f', 'fd.facturaId = f.id')
        .select([
          'p.id',
          'p.nombre',
          'p.precio',
          'p.stock',
          'COALESCE(SUM(fd.cantidad), 0) as unidadesVendidas',
          'COALESCE(SUM(fd.precioUnitario * fd.cantidad), 0) as ingresos'
        ])
        .where('f.createdAt IS NULL OR DATE(f.createdAt) BETWEEN :fechaInicio AND :fechaFin', {
          fechaInicio,
          fechaFin
        })
        .groupBy('p.id, p.nombre, p.precio, p.stock')
        .orderBy('ingresos', 'DESC')
        .getRawMany();

      // Agregar tendencias simuladas
      const serviciosConTendencia = servicios.map(servicio => ({
        ...servicio,
        cantidadServicios: parseInt(servicio.cantidadServicios) || 0,
        ingresos: parseFloat(servicio.ingresos) || 0,
        tendencia: Math.floor(Math.random() * 30) + 5
      }));

      const productosConTendencia = productos.map(producto => ({
        ...producto,
        unidadesVendidas: parseInt(producto.unidadesVendidas) || 0,
        ingresos: parseFloat(producto.ingresos) || 0,
        tendencia: Math.floor(Math.random() * 25) + 8
      }));

      // Calcular totales
      const totalServicios = serviciosConTendencia.reduce((sum, item) => sum + item.ingresos, 0);
      const totalProductos = productosConTendencia.reduce((sum, item) => sum + item.ingresos, 0);
      const totalServiciosRealizados = serviciosConTendencia.reduce((sum, item) => sum + item.cantidadServicios, 0);
      const totalProductosVendidos = productosConTendencia.reduce((sum, item) => sum + item.unidadesVendidas, 0);

      return {
        servicios: serviciosConTendencia,
        productos: productosConTendencia,
        resumen: {
          totalServicios,
          totalProductos,
          totalServiciosRealizados,
          totalProductosVendidos
        },
        periodo: {
          fechaInicio,
          fechaFin
        }
      };
    } catch (error) {
      console.error('Error al generar reporte completo:', error);
      throw new Error('Error al generar el reporte completo');
    }
  }

  async obtenerFacturacionPorPeriodo(fechaInicio: string, fechaFin: string) {
    return await this.facturaRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.detalles', 'd')
      .leftJoinAndSelect('f.cliente', 'c')
      .where('DATE(f.createdAt) BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .orderBy('f.createdAt', 'DESC')
      .getMany();
  }

  async obtenerEstadisticasServicios(fechaInicio?: string, fechaFin?: string) {
    const query = this.servicioRepo
      .createQueryBuilder('s')
      .leftJoin('factura_detalle', 'fd', 's.id = fd.itemId AND fd.tipo_item = :tipo', { tipo: 'servicio' })
      .leftJoin('factura', 'f', 'fd.facturaId = f.id')
      .select([
        's.id',
        's.servicio as nombre',
        's.precio',
        's.duracion',
        'COUNT(DISTINCT fd.id) as cantidadServicios',
        'SUM(fd.precioUnitario * fd.cantidad) as ingresos'
      ])
      .where('s.estado = :estado', { estado: true })
      .groupBy('s.id, s.servicio, s.precio, s.duracion');

    if (fechaInicio && fechaFin) {
      query.andWhere('DATE(f.createdAt) BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      });
    }

    return await query.getRawMany();
  }

  async obtenerEstadisticasProductos(fechaInicio?: string, fechaFin?: string) {
    const query = this.productoRepo
      .createQueryBuilder('p')
      .leftJoin('factura_detalle', 'fd', 'p.id = fd.itemId AND fd.tipo_item = :tipo', { tipo: 'producto' })
      .leftJoin('factura', 'f', 'fd.facturaId = f.id')
      .select([
        'p.id',
        'p.nombre',
        'p.precio',
        'p.stock',
        'COUNT(fd.id) as unidadesVendidas',
        'SUM(fd.precioUnitario * fd.cantidad) as ingresos'
      ])
      .groupBy('p.id, p.nombre, p.precio, p.stock');

    if (fechaInicio && fechaFin) {
      query.where('DATE(f.createdAt) BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      });
    }

    return await query.getRawMany();
  }
}