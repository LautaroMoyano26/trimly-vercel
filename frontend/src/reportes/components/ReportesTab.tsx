import React from 'react';

const ReportesTab: React.FC = () => {
  return (
    <div className="tab-content-wrapper">
      <div className="content-header">
        <h2 className="content-title">Dashboard de Reportes</h2>
        <p className="content-description">Análisis detallado de métricas y estadísticas del negocio</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3 className="card-title">Reportes de Ventas</h3>
          <p className="card-description">Análisis de ingresos y tendencias de ventas</p>
          <button className="card-button">Ver Reportes</button>
        </div>

        <div className="report-card">
          <h3 className="card-title">Reportes de Clientes</h3>
          <p className="card-description">Estadísticas y análisis de la base de clientes</p>
          <button className="card-button">Ver Reportes</button>
        </div>
      </div>
    </div>
  );
};

export default ReportesTab;