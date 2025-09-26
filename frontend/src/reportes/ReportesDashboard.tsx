import { useState } from "react";
import "./ReportesDashboard.css";
import { FaFileAlt, FaFileInvoiceDollar, FaFilePdf } from "react-icons/fa";
import FacturacionTab from "./components/FacturacionTab";
import { exportarReporteGeneral } from "../utils/pdfGenerator";

export default function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState("facturacion");

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
          <FaFilePdf /> Exportar a PDF
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
          className={`tab-button ${
            activeTab === "facturacion" ? "active" : ""
          }`}
          onClick={() => setActiveTab("facturacion")}
        >
          <FaFileInvoiceDollar /> Facturación
        </button>
      </div>

      {/* Content Area - Vacío por ahora */}
      <div className="tab-content">
        {activeTab === "reportes" && (
          <div className="tab-panel empty">
            <p className="empty-state">
              Contenido de Reportes - Por implementar
            </p>
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
}
