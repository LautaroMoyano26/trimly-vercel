import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import "./ReportesDashboard.css";

export default function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState<'reportes' | 'facturacion'>('reportes');

  const exportarPDF = () => {
    // TODO: Implementar exportar PDF
    alert("Exportar PDF - Funcionalidad pendiente");
  };

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <div className="header-left">
          <h1 className="reportes-title">Reportes y Facturación</h1>
          <p className="reportes-description">Análisis detallado y sistema de facturación</p>
        </div>
        <button className="exportar-pdf-btn" onClick={exportarPDF}>
          <FaFilePdf /> Exportar PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'reportes' ? 'active' : ''}`}
          onClick={() => setActiveTab('reportes')}
        >
          Reportes
        </button>
        <button
          className={`tab-button ${activeTab === 'facturacion' ? 'active' : ''}`}
          onClick={() => setActiveTab('facturacion')}
        >
          Facturación
        </button>
      </div>

      {/* Content Area - Vacío por ahora */}
      <div className="tab-content">
        {activeTab === 'reportes' && (
          <div className="tab-panel">
            <p className="empty-state">Contenido de Reportes - Por implementar</p>
          </div>
        )}
        {activeTab === 'facturacion' && (
          <div className="tab-panel">
            <p className="empty-state">Contenido de Facturación - Por implementar</p>
          </div>
        )}
      </div>
    </div>
  );
}