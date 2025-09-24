import React, { useState } from 'react';
import { BarChart, DollarSign } from 'lucide-react';
import { ReportesView } from './components/ReportesView';
import './ReportesDashboard.css';

export const ReportesDashboard: React.FC = () => {
  const [mainTab, setMainTab] = useState<'reportes' | 'facturacion'>('reportes');

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>Reportes y Facturación</h1>
        <p>Análisis detallado y sistema de facturación</p>
      </div>

      <div className="main-tabs">
        <button
          className={`main-tab-button ${mainTab === 'reportes' ? 'active' : ''}`}
          onClick={() => setMainTab('reportes')}
        >
          <BarChart size={16} /> Reportes
        </button>
        <button
          className={`main-tab-button ${mainTab === 'facturacion' ? 'active' : ''}`}
          onClick={() => setMainTab('facturacion')}
        >
          <DollarSign size={16} /> Facturación
        </button>
      </div>

      <div className="main-content-area">
        {mainTab === 'reportes' ? <ReportesView /> : <FacturacionView />}
      </div>
    </div>
  );
};