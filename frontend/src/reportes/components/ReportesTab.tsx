import React, { useState } from 'react';
import { PeriodSelector } from './PeriodSelector';
import { ServiciosReport } from './ServiciosReport';
import { ProductosReport } from './ProductosReport';
import { useReportes } from '../hooks/useReportes';
import './ReportesTab.css';

export const ReportesTab: React.FC = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [activeTab, setActiveTab] = useState<'servicios' | 'productos'>('servicios');

  const { datosReporte, isLoading, error, generarReporte } = useReportes();

  // Validar que las fechas estén seleccionadas y sean válidas
  const isValidForm = startDate && endDate && startDate <= endDate;

  const handleGenerateReport = async () => {
    if (!isValidForm) return;
    
    try {
      await generarReporte(startDate, endDate);
    } catch (error) {
      console.error('Error al generar reporte:', error);
    }
  };

  const formatPeriod = () => {
    if (!startDate || !endDate) return '';
    const inicio = new Date(startDate).toLocaleDateString('es-AR');
    const fin = new Date(endDate).toLocaleDateString('es-AR');
    return `${inicio} al ${fin}`;
  };

  return (
    <div className="reportes-tab-container">
      {/* Header */}
      <div className="content-header">
        <h2 className="reportes-title">
          Reportes y Facturación
        </h2>
        <p className="reportes-description">
          Análisis detallado y sistema de facturación
        </p>
      </div>

      {/* Selector de Período */}
      <PeriodSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGenerateReport={handleGenerateReport}
        isLoading={isLoading}
        isValid={isValidForm}
      />

      {/* Mostrar error si existe */}
      {error && (
        <div className="error-message">
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Sistema de Pestañas de Reportes */}
      {datosReporte && (
        <>
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('servicios')}
              className={`tab-button ${activeTab === 'servicios' ? 'servicios' : ''}`}
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('productos')}
              className={`tab-button ${activeTab === 'productos' ? 'productos' : ''}`}
            >
              Productos
            </button>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === 'servicios' ? (
            <ServiciosReport
              servicios={datosReporte.servicios}
              periodo={formatPeriod()}
              totalServicios={datosReporte.resumen.totalServicios}
              totalServiciosRealizados={datosReporte.resumen.totalServiciosRealizados}
            />
          ) : (
            <ProductosReport
              productos={datosReporte.productos}
              periodo={formatPeriod()}
              totalProductos={datosReporte.resumen.totalProductos}
              totalProductosVendidos={datosReporte.resumen.totalProductosVendidos}
            />
          )}
        </>
      )}

      {/* Mensaje cuando no hay reporte generado */}
      {!datosReporte && !isLoading && (
        <div className="empty-state">
          <p className="empty-state-text">
            Selecciona un período y genera un reporte para ver los análisis
          </p>
        </div>
      )}
    </div>
  );
};