export interface ReporteServicio {
  id: number;
  nombre: string;
  precio: number;
  duracion: number;
  cantidadServicios: number;
  ingresos: number;
  tendencia: number;
}

export interface ReporteProducto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  unidadesVendidas: number;
  ingresos: number;
  tendencia: number;
}

export interface Servicio {
  id: number;
  servicio: string;
  descripcion: string;
  duracion: number;
  precio: number;
  estado: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  estado: string;
  categoria: string;
  marca: string;
}

export interface DatosReporte {
  servicios: ReporteServicio[];
  productos: ReporteProducto[];
  resumen: {
    totalServicios: number;
    totalProductos: number;
    totalServiciosRealizados: number;
    totalProductosVendidos: number;
  };
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export interface ReporteFacturacion {
  periodo: string;
  totalFacturado: number;
  totalServicios: number;
  totalProductos: number;
  serviciosMasVendidos: ReporteServicio[];
  productosMasVendidos: ReporteProducto[];
}

export interface FiltrosReporte {
  fechaInicio?: string;
  fechaFin?: string;
  categoria?: string;
  tipo: 'servicios' | 'productos' | 'facturacion';
}

// Exportar tipos específicos
export type { ReporteServicio, ReporteProducto, DatosReporte };// Removed export type statement to avoid conflicts