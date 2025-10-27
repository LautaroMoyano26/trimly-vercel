import React, { useState, useRef } from "react";
import "./ReportesDashboard.css";
import { FaFileAlt, FaFileInvoiceDollar, FaFilePdf, FaQuestionCircle } from "react-icons/fa";
import FacturacionTab from "./components/FacturacionTab";
import { ReportesView } from "./components/ReportesView";
import type { ReportesViewHandle } from "./components/ReportesView";
import { OrganizacionPDFs } from "../components/OrganizacionPDFs";
// import { exportarReporteGeneral, exportarReporteCompleto } from "../utils/pdfGenerator";

const ReportesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reportes" | "facturacion">("facturacion");
  const [showOrganizacionModal, setShowOrganizacionModal] = useState(false);
  const reportesViewRef = useRef<ReportesViewHandle>(null);

  const handleExportarPDF = async () => {
    try {
      // TODO: Reactivar cuando se arregle pdfGenerator.ts
      alert("Función de exportación PDF temporalmente deshabilitada");
      /* if (activeTab === "reportes" && reportesViewRef.current) {
        // Intentar obtener los datos del componente ReportesView
        const datosReporte = reportesViewRef.current.exportarDatos();
        
        if (datosReporte && datosReporte.resumen.ingresosTotales > 0) {
          // Si hay datos específicos, generar reporte completo
          exportarReporteCompleto(datosReporte);
        } else {
          // Si no hay datos específicos, generar reporte general
          await exportarReporteGeneral();
        }
      } else {
        // Para la pestaña de facturación o cuando no hay datos específicos
        await exportarReporteGeneral();
      } */
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el PDF del reporte");
    }
  };

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <div className="header-left">
          <h1 className="reportes-title">Reportes y Facturación</h1>
          <p className="reportes-description">
            Analiza datos y gestiona la facturación
          </p>
        </div>
        <div className="header-buttons">
          <button 
            className="help-btn" 
            onClick={() => setShowOrganizacionModal(true)}
            title="Organización de PDFs"
          >
            <FaQuestionCircle /> Organizar PDFs
          </button>
          {activeTab === "reportes" && (
            <button className="exportar-pdf-btn" onClick={handleExportarPDF}>
              <FaFilePdf /> Exportar PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "reportes" ? "active" : ""}`}
          onClick={() => setActiveTab("reportes")}
        >
          <FaFileAlt /> Reportes
        </button>
        <button
          className={`tab-button ${activeTab === "facturacion" ? "active" : ""}`}
          onClick={() => setActiveTab("facturacion")}
        >
          <FaFileInvoiceDollar /> Facturación
        </button>
      </div>

      {/* Content Area */}
      <div className="tab-content">
        {activeTab === "reportes" && (
          <div className="tab-panel">
            <ReportesView ref={reportesViewRef} />
          </div>
        )}
        {activeTab === "facturacion" && (
          <div className="tab-panel">
            <FacturacionTab />
          </div>
        )}
      </div>

      {/* Modal de Organización de PDFs */}
      {showOrganizacionModal && (
        <OrganizacionPDFs onClose={() => setShowOrganizacionModal(false)} />
      )}
    </div>
  );
};

export default ReportesDashboard;
