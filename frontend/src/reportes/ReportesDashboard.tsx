import { useState } from "react";
import "./ReportesDashboard.css";
import { FaFileAlt, FaFileInvoiceDollar, FaFilePdf } from "react-icons/fa";
import FacturacionTab from "./components/FacturacionTab";

export default function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState("facturacion");

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
        <button className="exportar-pdf-btn">
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
