import React from 'react';

const FacturacionTab: React.FC = () => {
  return (
    <div className="tab-content-wrapper">
      <div className="content-header">
        <h2 className="content-title">Sistema de Facturación</h2>
        <p className="content-description">Gestión de pagos, facturación y procesamiento de transacciones</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3 className="card-title">Generar Facturas</h3>
          <p className="card-description">Crear y gestionar facturas de servicios</p>
          <button className="card-button">Nueva Factura</button>
        </div>

        <div className="report-card">
          <h3 className="card-title">Gestión de Pagos</h3>
          <p className="card-description">Procesar y rastrear pagos de clientes</p>
          <button className="card-button">Ver Pagos</button>
        </div>
      </div>
    </div>
  );
};

export default FacturacionTab;