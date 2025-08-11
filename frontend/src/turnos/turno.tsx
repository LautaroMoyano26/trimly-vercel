import React, { useState, useEffect } from "react";
import { FaPlus, FaClock, FaUser } from "react-icons/fa";
import "./turno.css";
import NuevoTurnoModal from "./NuevoTurnoModal";

export default function Turnos() {
  const [showModal, setShowModal] = useState(false);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Cargar turnos desde la API
  useEffect(() => {
    fetch("http://localhost:3000/turnos")
      .then(res => res.json())
      .then(data => setTurnos(Array.isArray(data) ? data : []))
      .catch(() => setTurnos([]));
  }, [showModal]); // recarga al cerrar modal

  // Filtrar turnos del día seleccionado
  const fechaStr = selectedDate.toISOString().split("T")[0];
  const turnosDelDia = turnos.filter(t => t.fecha === fechaStr);

  // Formatear fecha para mostrar en español
  const fechaFormateada = selectedDate.toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Navegación de días
  const cambiarDia = (delta: number) => {
    const nuevaFecha = new Date(selectedDate);
    nuevaFecha.setDate(nuevaFecha.getDate() + delta);
    setSelectedDate(nuevaFecha);
  };

  return (
    <div className="turnos-dashboard-container">
      <div className="turnos-header-row">
        <div>
          <h1 className="turnos-title">Turnos</h1>
          <p className="turnos-desc">Gestiona los turnos de tu peluquería</p>
        </div>
        <button className="nuevo-turno-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Nuevo turno
        </button>
      </div>
      <div className="turnos-tabs-row">
        <button className="tab-btn active">Día</button>
        <button className="tab-btn">Semana</button>
        <button className="tab-btn">Mes</button>
      </div>
      <div className="turnos-date-row">
        <button className="date-nav-btn" onClick={() => cambiarDia(-1)}>&lt;</button>
        <span className="turnos-date-label">{fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}</span>
        <button className="date-nav-btn" onClick={() => cambiarDia(1)}>&gt;</button>
      </div>
      <div className="turnos-list-section">
        {turnosDelDia.length === 0 ? (
          <div className="no-turnos-msg">
            No hay turnos programados para este día
          </div>
        ) : (
          <ul className="turnos-list">
            {turnosDelDia.map((turno) => (
              <li key={turno.id} className="turno-card">
                <div className="turno-card-left">
                  <div className="turno-card-icon">
                    <FaClock size={28} color="#23b3c7" />
                  </div>
                  <div className="turno-card-info">
                    <div className="turno-card-servicio">{turno.servicio?.servicio || "-"}</div>
                    <div className="turno-card-meta">
                      <span className="turno-card-hora">
                        <FaClock size={13} style={{marginRight: 4, marginBottom: -2}} />
                        {turno.hora ? `${turno.hora} (Estimado)` : "hh:mm (Estimado)"}
                      </span>
                      <span className="turno-card-cliente">
                        <FaUser size={13} style={{marginRight: 4, marginBottom: -2}} />
                        {turno.cliente?.nombre} {turno.cliente?.apellido}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="turno-card-actions">
                  <button className="turno-btn editar">Editar</button>
                  <button className="turno-btn cancelar">Cancelar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <NuevoTurnoModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}