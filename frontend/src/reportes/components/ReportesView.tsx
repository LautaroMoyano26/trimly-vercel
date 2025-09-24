import React, { useState, useEffect } from 'react';
import { Calendar, LineChart } from 'lucide-react';
import { useReportes } from '../hooks/useReportes';
import { ServiciosReport } from './ServiciosReport';
import { ProductosReport } from './ProductosReport';
import '../ReportesDashboard.css';

export const ReportesView: React.FC = () => {
  const [reportTab, setReportTab] = useState<'servicios' | 'productos'>('servicios');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');

  const { datosReporte, isLoading, error, getReportesPorPeriodo, loadInitialReport } = useReportes();

  // Carga el reporte inicial al montar el componente
  useEffect(() => {
    const { fechaInicioISO, fechaFinISO } = loadInitialReport();
    setFechaInicio(fechaInicioISO);
    setFechaFin(fechaFinISO);
    setPeriodoSeleccionado(`${fechaInicioISO.split('-').reverse().join('/')} al ${fechaFinISO.split('-').reverse().join('/')}`);
  }, [loadInitialReport]);


  const handleGenerateReport = () => {
    if (!fechaInicio || !fechaFin) return;
    const periodoQuery = `fechaInicio=${fechaInicio}T00:00:00.000Z&fechaFin=${fechaFin}T23:59:59.999Z`;
    getReportesPorPeriodo(periodoQuery);
    setPeriodoSeleccionado(`${fechaInicio.split('-').reverse().join('/')} al ${fechaFin.split('-').reverse().join('/')}`);
  };

  return (
    <>
      <div className="periodo-selector">
        <div className="periodo-header">
          <Calendar size={20} color="#00e6e6" />
          <h3>Seleccionar Período de Análisis</h3>
        </div>
        <div className="periodo-inputs">
          <div className="input-group">
            <label htmlFor="fechaInicio">Fecha de Inicio</label>
            <input type="date" id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="fechaFin">Fecha de Fin</label>
            <input type="date" id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          <button className="generate-report-button" onClick={handleGenerateReport} disabled={isLoading}>
            <LineChart size={16} /> {isLoading ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      {isLoading && <p className="loading-message">Cargando reporte...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && datosReporte && (
        <div className="report-content">
          <div className="report-tabs">
            <button
              className={`report-tab-button ${reportTab === 'servicios' ? 'active' : ''}`}
              onClick={() => setReportTab('servicios')}
            >
              Servicios
            </button>
            <button
              className={`report-tab-button ${reportTab === 'productos' ? 'active' : ''}`}
              onClick={() => setReportTab('productos')}
            >
              Productos
            </button>
          </div>

          {reportTab === 'servicios' && (
            <ServiciosReport
              servicios={datosReporte.servicios}
              periodo={periodoSeleccionado}
              totalServicios={datosReporte.totalServicios}
              totalServiciosRealizados={datosReporte.totalServiciosRealizados}
            />
          )}
          {reportTab === 'productos' && (
            <ProductosReport
              productos={datosReporte.productos}
              periodo={periodoSeleccionado}
              totalProductos={datosReporte.totalProductos}
              totalProductosVendidos={datosReporte.totalProductosVendidos}
            />
          )}
        </div>
      )}
    </>
  );
};