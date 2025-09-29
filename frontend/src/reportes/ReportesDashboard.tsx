import React, { useState } from "react";
import "./ReportesDashboard.css";
import { FaFileAlt, FaFileInvoiceDollar, FaFilePdf } from "react-icons/fa";
import FacturacionTab from "./components/FacturacionTab";
import { ReportesView } from "./components/ReportesView";
import { exportarReporteGeneral } from "../utils/pdfGenerator";

const ReportesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reportes" | "facturacion">("facturacion");

  const handleExportarPDF = async () => {
    try {
      await exportarReporteGeneral();
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
        <button className="exportar-pdf-btn" onClick={handleExportarPDF}>
          <FaFilePdf /> Exportar PDF
        </button>
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
            <ReportesView />
          </div>
        )}
        {activeTab === "facturacion" && (
          <div className="tab-panel">
            <FacturacionTab />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesDashboard;
