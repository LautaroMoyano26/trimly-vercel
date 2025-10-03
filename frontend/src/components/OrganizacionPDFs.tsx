import React from 'react';
import { FaFolder, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './OrganizacionPDFs.css';

interface OrganizacionPDFsProps {
  onClose: () => void;
}

export const OrganizacionPDFs: React.FC<OrganizacionPDFsProps> = ({ onClose }) => {
  return (
    <div className="organizacion-overlay">
      <div className="organizacion-modal">
        <div className="organizacion-header">
          <FaFolder className="folder-icon" />
          <h3>Organización de PDFs TRIMLY</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="organizacion-content">
          <div className="info-section">
            <FaInfoCircle className="info-icon" />
            <p>Para una mejor organización, recomendamos crear la siguiente estructura en tu escritorio:</p>
          </div>
          
          <div className="folder-structure">
            <div className="folder-item">
              <FaFolder className="folder-small" />
              <span>📁 TRIMLY_PDFs/</span>
            </div>
            <div className="subfolder">
              <div className="folder-item">
                <FaFolder className="folder-small" />
                <span>📁 Facturas/</span>
              </div>
              <div className="subfolder">
                <div className="folder-item">
                  <FaFolder className="folder-small" />
                  <span>📁 2025/</span>
                </div>
                <div className="folder-item">
                  <FaFolder className="folder-small" />
                  <span>📁 2024/</span>
                </div>
              </div>
            </div>
            <div className="subfolder">
              <div className="folder-item">
                <FaFolder className="folder-small" />
                <span>📁 Reportes/</span>
              </div>
              <div className="subfolder">
                <div className="folder-item">
                  <FaFolder className="folder-small" />
                  <span>📁 Mensuales/</span>
                </div>
                <div className="folder-item">
                  <FaFolder className="folder-small" />
                  <span>📁 Anuales/</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tips-section">
            <h4>💡 Consejos de organización:</h4>
            <ul>
              <li>Los archivos ahora se descargan con nombres organizados que incluyen "TRIMLY_Facturas_" o "TRIMLY_Reportes_"</li>
              <li>Puedes usar el buscador de Windows para encontrar rápidamente archivos por "TRIMLY_"</li>
              <li>Los nombres incluyen fecha y hora para evitar duplicados</li>
              <li>Configura tu navegador para descargar en una carpeta específica</li>
            </ul>
          </div>
        </div>
        
        <div className="organizacion-footer">
          <button className="btn-primary" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};