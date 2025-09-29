import React, { useEffect, useState } from 'react';
import { Calendar, Package, Scissors, ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';
import type { DatosReporte } from '../types/reportes.types';
import './ReportesView.css';

// Servicios definidos ANTES del componente
const reportesService = {
  async getReportes(fechaInicio: string, fechaFin: string) {
    const response = await fetch(`http://localhost:3000/reportes/completo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    if (!response.ok) throw new Error('Error al obtener reportes');
    return await response.json();
  }
};

const serviciosService = {
  async getServicios() {
    const response = await fetch('http://localhost:3000/servicios');
    if (!response.ok) throw new Error('Error al obtener servicios');
    return await response.json();
  }
};

const productosService = {
  async getProductos() {
    const response = await fetch('http://localhost:3000/producto');
    if (!response.ok) throw new Error('Error al obtener productos');
    return await response.json();
  }
};

interface ServicioCompleto {
  id: number;
  servicio?: string;
  nombre?: string;
  descripcion?: string;
  precio: number;
  duracion?: number;
  cantidad?: number;
  ingresos?: number;
}

interface ProductoCompleto {
  id: number;
  nombre: string;
  categoria?: string;
  marca?: string;
  precio: number;
  stock?: number;
  cantidad?: number;
  ingresos?: number;
}

export const ReportesView: React.FC = () => {
  const [datos, setDatos] = useState<DatosReporte>({
    resumen: {
      total_turnos: 0,
      ingresos_totales: 0,
      total_servicios: 0,
      total_productos: 0,
    },
    servicios: [],
    productos: [],
    periodo: { fechaInicio: '', fechaFin: '' },
  });
  const [todosServicios, setTodosServicios] = useState<ServicioCompleto[]>([]);
  const [todosProductos, setTodosProductos] = useState<ProductoCompleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
  const [activeTab, setActiveTab] = useState<'servicios' | 'productos'>('servicios');

  const cargarTodosLosItems = async () => {
    try {
      console.log('Cargando servicios y productos...');
      const [servicios, productos] = await Promise.all([
        serviciosService.getServicios(),
        productosService.getProductos()
      ]);
      
      console.log('Servicios obtenidos:', servicios);
      console.log('Productos obtenidos:', productos);
      
      setTodosServicios(servicios || []);
      setTodosProductos(productos || []);
    } catch (error) {
      console.error('Error cargando items:', error);
      setTodosServicios([]);
      setTodosProductos([]);
    }
  };

  const cargar = async (inicio: string, fin: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Cargando reporte para período: fechaInicio=${inicio}&fechaFin=${fin}`);
      
      const res = await reportesService.getReportes(inicio, fin);
      console.log('Datos del reporte:', res);
      
      setDatos(res);
      setPeriodoSeleccionado(`${inicio.split('-').reverse().join('/')} al ${fin.split('-').reverse().join('/')}`);
    } catch (e) {
      console.error('Error cargando reporte:', e);
      setError('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!fechaInicio || !fechaFin) return;
    cargar(fechaInicio, fechaFin);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '30m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  const getNombreServicio = (servicio: ServicioCompleto) => {
    return servicio.servicio || servicio.nombre || 'Servicio sin nombre';
  };

  const getServiciosCompletos = () => {
    if (todosServicios.length === 0) {
      return [];
    }

    return todosServicios.map(servicio => {
      const reporteServicio = datos.servicios.find(s => 
        s.id === servicio.id || s.nombre === getNombreServicio(servicio)
      );
      
      return {
        ...servicio,
        cantidad: reporteServicio?.cantidad || 0,
        ingresos: reporteServicio?.ingresos || 0
      };
    });
  };

  const getProductosCompletos = () => {
    if (todosProductos.length === 0) {
      return [];
    }

    return todosProductos.map(producto => {
      const reporteProducto = datos.productos.find(p => 
        p.id === producto.id || p.nombre === producto.nombre
      );
      
      return {
        ...producto,
        cantidad: reporteProducto?.cantidad || 0,
        ingresos: reporteProducto?.ingresos || 0
      };
    });
  };

  useEffect(() => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fi = inicioMes.toISOString().split('T')[0];
    const ff = hoy.toISOString().split('T')[0];
    setFechaInicio(fi);
    setFechaFin(ff);
    
    cargarTodosLosItems();
    cargar(fi, ff);
  }, []);

  if (loading) {
    return (
      <div className="loading-message">
        Generando reporte...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  const serviciosCompletos = getServiciosCompletos();
  const productosCompletos = getProductosCompletos();
  const totalServiciosRealizados = serviciosCompletos.reduce((acc, s) => acc + (s.cantidad || 0), 0);
  const totalIngresosServicios = serviciosCompletos.reduce((acc, s) => acc + (s.ingresos || 0), 0);
  const totalProductosVendidos = productosCompletos.reduce((acc, p) => acc + (p.cantidad || 0), 0);
  const totalIngresosProductos = productosCompletos.reduce((acc, p) => acc + (p.ingresos || 0), 0);

  return (
    <div className="reportes-view">
      {/* Sección de Selección de Período */}
      <div className="period-selector-card">
        <div className="period-selector-header">
          <Calendar size={20} className="text-cyan-400" />
          <h3 className="period-selector-title">Seleccionar Período de Análisis</h3>
        </div>

        <div className="period-selector-grid">
          <div className="input-group">
            <label className="input-label">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Fecha de Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="date-input"
            />
          </div>
          <button
            className="generate-report-button"
            onClick={handleGenerateReport}
            disabled={!fechaInicio || !fechaFin || loading}
          >
            <BarChart3 size={16} />
            {loading ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>

        {periodoSeleccionado && (
          <div className="period-indicator">
            <p className="period-indicator-text">
              Período seleccionado: <span className="period-date">{periodoSeleccionado}</span>
            </p>
          </div>
        )}
      </div>

      {/* Sistema de Pestañas */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'servicios' ? 'tab-servicios-active' : 'tab-inactive'}`}
          onClick={() => setActiveTab('servicios')}
        >
          <Scissors size={16} />
          Servicios ({serviciosCompletos.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'productos' ? 'tab-productos-active' : 'tab-inactive'}`}
          onClick={() => setActiveTab('productos')}
        >
          <Package size={16} />
          Productos ({productosCompletos.length})
        </button>
      </div>

      {/* Contenido de Pestañas */}
      <div className="tab-content">
        {activeTab === 'servicios' && (
          <div className="services-content">
            <h2 className="content-title">
              Análisis de Servicios - {periodoSeleccionado || 'Selecciona un período'}
            </h2>
            
            <div className="items-list">
              {serviciosCompletos.length > 0 ? (
                serviciosCompletos.map((servicio) => (
                  <div key={servicio.id} className={`item-card ${servicio.cantidad > 0 ? 'has-sales' : ''}`}>
                    <div className="item-left">
                      <div className="icon-circle servicios">
                        <Scissors size={20} className="text-purple-400" />
                      </div>
                      <div className="item-info">
                        <h4 className="item-name">{getNombreServicio(servicio)}</h4>
                        <p className="item-subtitle">
                          {servicio.cantidad || 0} servicios realizados • {formatDuration(servicio.duracion)}
                        </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <div className="item-amount">{formatCurrency(servicio.ingresos || 0)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Scissors size={48} className="text-purple-400/50" />
                  <p>No se pudieron cargar los servicios</p>
                  <p className="text-sm">Verifica que el backend esté ejecutándose</p>
                </div>
              )}

              {serviciosCompletos.length > 0 && (
                <div className="total-row servicios">
                  <div className="total-left">
                    <div className="total-icon servicios">
                      <TrendingUp size={20} className="text-purple-400" />
                    </div>
                    <div className="total-info">
                      <h4 className="total-title">Total Servicios</h4>
                      <p className="total-subtitle">{totalServiciosRealizados} servicios totales</p>
                    </div>
                  </div>
                  <div className="total-right">
                    <div className="total-amount servicios">{formatCurrency(totalIngresosServicios)}</div>
                    <p className="total-label">Ingresos totales</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="products-content">
            <h2 className="content-title">
              Análisis de Productos - {periodoSeleccionado || 'Selecciona un período'}
            </h2>
            
            <div className="items-list">
              {productosCompletos.length > 0 ? (
                productosCompletos.map((producto) => (
                  <div key={producto.id} className={`item-card ${producto.cantidad > 0 ? 'has-sales' : ''}`}>
                    <div className="item-left">
                      <div className="icon-circle productos">
                        <Package size={20} className="text-cyan-400" />
                      </div>
                      <div className="item-info">
                        <h4 className="item-name">{producto.nombre}</h4>
                        <p className="item-subtitle">
                          {producto.cantidad || 0} unidades vendidas
                          {producto.categoria && ` • ${producto.categoria}`}
                        </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <div className="item-amount">{formatCurrency(producto.ingresos || 0)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Package size={48} className="text-cyan-400/50" />
                  <p>No se pudieron cargar los productos</p>
                  <p className="text-sm">Verifica que el backend esté ejecutándose</p>
                </div>
              )}

              {productosCompletos.length > 0 && (
                <div className="total-row productos">
                  <div className="total-left">
                    <div className="total-icon productos">
                      <ShoppingCart size={20} className="text-cyan-400" />
                    </div>
                    <div className="total-info">
                      <h4 className="total-title">Total Productos</h4>
                      <p className="total-subtitle">{totalProductosVendidos} productos vendidos</p>
                    </div>
                  </div>
                  <div className="total-right">
                    <div className="total-amount productos">{formatCurrency(totalIngresosProductos)}</div>
                    <p className="total-label">Ingresos totales</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};