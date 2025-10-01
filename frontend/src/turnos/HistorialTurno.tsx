import React from "react";
import { FaClock } from "react-icons/fa";
import "./HistorialTurno.css";

interface Props {
  show: boolean;
  onClose: () => void;
}

const HistorialTurnosModal: React.FC<Props> = ({ show, onClose }) => {
  if (!show) return null;

  // 🔹 Datos de ejemplo SOLO para frontend
  const turnos = [
    {
      id: 1,
      cliente: "Juan Luna",
      servicio: "Corte de cabello",
      fecha: "2025-06-02",
      hora: "16:00",
      encargado: "Jesus Martínez",
      precio: 8000,
      estado: "Pagado",
    },
    {
      id: 2,
      cliente: "Roberto Silva",
      servicio: "Barba",
      fecha: "2025-06-02",
      hora: "14:30",
      encargado: "Carlos Rodríguez",
      precio: 4000,
      estado: "Pagado",
    },
    {
      id: 3,
      cliente: "Carmen Vega",
      servicio: "Peinado para evento",
      fecha: "2025-06-01",
      hora: "18:00",
      encargado: "Sofía López",
      precio: 5000,
      estado: "Pendiente",
    },
  ];

  return (
    <div className="historial-overlay">
      <div className="historial-container">
        <div className="historial-header">
          <h2>Historial de Turnos</h2>
          <p>Últimos turnos realizados y facturados</p>
        </div>

        <div className="historial-list">
          {turnos.length === 0 ? (
            <p className="historial-empty">No hay turnos el día de hoy</p>
          ) : (
            turnos.map((turno) => (
              <div key={turno.id} className="historial-card">
                <div className="historial-icon">
                  <FaClock />
                </div>
                <div className="historial-info">
                  <h3>{turno.cliente}</h3>
                  <p>{turno.servicio}</p>
                  <span>
                    {turno.fecha} - {turno.hora} • Por: {turno.encargado}
                  </span>
                </div>
                <div className="historial-status">
                  <strong>${turno.precio}</strong>
                  {turno.estado === "Pagado" ? (
                    <span className="pagado"> Pagado</span>
                  ) : (
                    <span className="pendiente">Pendiente</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="historial-footer">
          <button onClick={onClose} className="cerrar-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialTurnosModal;
