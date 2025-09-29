import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';
import './PeriodSelector.css';

interface PeriodSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onGenerateReport: () => void;
  isLoading: boolean;
  isValid: boolean;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerateReport,
  isLoading,
  isValid
}) => {
  return (
    <div className="period-selector-container">
      <div className="period-selector-header">
        <Calendar size={20} color="#00e6e6" />
        <h3 className="period-selector-title">
          Seleccionar Período de Análisis
        </h3>
      </div>

      <div className="period-selector-grid">
        <div className="date-input-container">
          <label className="date-label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="date-input-container">
          <label className="date-label">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="generate-button-container">
          <button
            onClick={onGenerateReport}
            disabled={!isValid || isLoading}
            className={`generate-button ${isValid && !isLoading ? 'enabled' : 'disabled'}`}
          >
            <BarChart3 size={16} />
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      {/* Indicador de período */}
      {startDate && endDate && (
        <div className="period-indicator">
          <p className="period-indicator-text">
            Período seleccionado: <span className="period-date">{startDate}</span> al <span className="period-date">{endDate}</span>
          </p>
        </div>
      )}
    </div>
  );
};