export interface ProductoReporte {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  cantidad: number;
  ingresos: number;
}

export interface ServicioReporte {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  ingresos: number;
}

export interface ResumenReporte {
  total_turnos: number;
  ingresos_totales: number;
  total_servicios: number;
  total_productos: number;
}

export interface DatosReporte {
  resumen: ResumenReporte;
  servicios: ServicioReporte[];
  productos: ProductoReporte[];
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export interface TurnoFacturacion {
  id: number;
  fecha_turno: string;
  hora_turno: string;
  cliente_nombre: string;
  cliente_telefono: string;
  precio_total: number;
  estado: string;
  servicios: string;
  productos: string;
}

export interface ReporteServicio {
  id: string | number;
  nombre: string;
  cantidadServicios: number;
  duracion: number;
  ingresos: number;
  tendencia: number;
}

export interface ReporteProducto {
  id: string | number;
  nombre: string;
  unidadesVendidas: number;
  ingresos: number;
  stock: number;
  tendencia: number;
}