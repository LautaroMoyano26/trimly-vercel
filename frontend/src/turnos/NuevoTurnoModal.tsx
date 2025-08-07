import React from "react";
import "./NuevoTurnoModal.css";

export default function NuevoTurnoModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 id="title">Nuevo Turno</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Cliente</label>
            <select>
              <option value="">Seleccionar cliente</option>
              {/* Opciones de clientes */}
            </select>
          </div>
          <div className="form-group">
            <label>Servicio</label>
            <select>
              <option value="">Seleccionar servicio</option>
              {/* Opciones de servicios */}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Hora</label>
            <input type="time" />
          </div>
        </div>
        <div className="form-group">
          <label>Notas adicionales</label>
          <textarea rows={2} placeholder="Notas adicionales..." />
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn">Guardar Turno</button>
        </div>
      </div>
    </div>
  );
}