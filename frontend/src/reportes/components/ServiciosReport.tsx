import React from 'react';
import { Scissors, TrendingUp } from 'lucide-react';
import type { ReporteServicio } from '../types/reportes.types';
import './ServiciosReport.css'; 


interface ServiciosReportProps {
  servicios: ReporteServicio[];
  periodo: string;
  totalServicios: number;
  totalServiciosRealizados: number;
}

export const ServiciosReport: React.FC<ServiciosReportProps> = ({
  servicios,
  periodo,
  totalServicios,
  totalServiciosRealizados
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  return (
    <div className="servicios-report-container">
      <h3 className="servicios-report-title">
        Análisis de Servicios - {periodo}
      </h3>

      <div className="servicios-list">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="servicio-item">
            <div className="servicio-left">
              <div className="servicio-icon">
                <Scissors size={20} color="#8B47EE" />
              </div>
              <div className="servicio-info">
                <h4>{servicio.nombre}</h4>
                <p>
                  {servicio.cantidadServicios} servicios realizados • {formatDuration(servicio.duracion)}
                </p>
              </div>
            </div>

            <div className="servicio-right">
              <div className="servicio-ingresos">
                {formatCurrency(servicio.ingresos)}
              </div>
              <div className="servicio-tendencia">
                +{servicio.tendencia}%
              </div>
            </div>
          </div>
        ))}

        {/* Fila de totales */}
        <div className="servicios-total">
          <div className="servicios-total-left">
            <div className="servicios-total-icon">
              <TrendingUp size={20} color="#8B47EE" />
            </div>
            <div className="servicios-total-info">
              <h4>Total Servicios</h4>
              <p>{totalServiciosRealizados} servicios totales</p>
            </div>
          </div>

          <div className="servicios-total-right">
            <div className="servicios-total-amount">
              {formatCurrency(totalServicios)}
            </div>
            <p className="servicios-total-label">
              Ingresos totales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};