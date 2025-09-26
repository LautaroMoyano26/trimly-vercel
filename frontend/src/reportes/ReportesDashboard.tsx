import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import "./ReportesDashboard.css";
import FacturacionTab from "./components/FacturacionTab";
import { ReportesView } from "./components/ReportesView";

const ReportesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reportes" | "facturacion">("reportes");

  const handleExportPDF = () => {
    // Implementar exportación PDF
    console.log("Exportar PDF");
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <div className="header-left">
          <h1 className="reportes-title">Reportes</h1>
          <p className="reportes-description">
            Analiza el rendimiento de tu barbería con reportes detallados
          </p>
        </div>
        <button className="exportar-pdf-btn" onClick={handleExportPDF}>
          <FaFilePdf />
          Exportar PDF
        </button>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "reportes" ? "active" : ""}`}
          onClick={() => setActiveTab("reportes")}
        >
          Reportes
        </button>
        <button
          className={`tab-button ${activeTab === "facturacion" ? "active" : ""}`}
          onClick={() => setActiveTab("facturacion")}
        >
          Facturación
        </button>
      </div>

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