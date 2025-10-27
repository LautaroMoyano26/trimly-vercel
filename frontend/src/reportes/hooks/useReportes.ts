import { useState, useCallback, useEffect } from 'react';
import { reportesService } from '../services/reportes.service';
import type { DatosReporte } from '../types/reportes.types';

export const useReportes = () => {
  const [datosReporte, setDatosReporte] = useState<DatosReporte | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true para la carga inicial
  const [error, setError] = useState<string | null>(null);

  const getReportesPorPeriodo = useCallback(async (periodoQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const datos = await reportesService.getReportes(periodoQuery);
      setDatosReporte(datos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el reporte';
      setError(errorMessage);
      setDatosReporte(null); // Limpia datos si hay error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para la carga inicial del reporte
  const loadInitialReport = useCallback(() => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - 30); // Por defecto, los últimos 30 días

    const fechaFinISO = fechaFin.toISOString().split('T')[0];
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    
    const periodoQuery = `fechaInicio=${fechaInicioISO}T00:00:00.000Z&fechaFin=${fechaFinISO}T23:59:59.999Z`;
    getReportesPorPeriodo(periodoQuery);

    // Retornamos las fechas para que la UI se actualice
    return { fechaInicioISO, fechaFinISO };

  }, [getReportesPorPeriodo]);


  const limpiarReporte = () => {
    setDatosReporte(null);
    setError(null);
  };

  return {
    datosReporte,
    isLoading,
    error,
    getReportesPorPeriodo,
    limpiarReporte,
    loadInitialReport, // Exponemos la nueva función
  };
};