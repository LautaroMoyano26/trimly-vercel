import React from 'react';
import FacturacionTab from '../reportes/components/FacturacionTab';
import './FacturacionPage.css';

const FacturacionPage: React.FC = () => {
  return (
    <div className="facturacion-page">
      <div className="facturacion-header">
        <h1>Facturación</h1>
        <p>Gestión de facturas y cobranzas</p>
      </div>
      
      <div className="facturacion-content">
        <FacturacionTab />
      </div>
    </div>
  );
};

export default FacturacionPage;