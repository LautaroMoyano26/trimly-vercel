import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./calendar-dark.css";
import { FaPlus, FaClock, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import "./turno.css";
import NuevoTurnoModal from "./NuevoTurnoModal";
import EditarTurnoModal from "./EditarTurnoModal";

export default function Turnos() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [turnos, setTurnos] = useState<any[]>([]);
  const [turnoToEdit, setTurnoToEdit] = useState<any>(null); // State for the turno being edited
  // Solo selección de un día
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [activeTab, setActiveTab] = useState<"dia" | "semana">("dia");
  const [clientes, setClientes] = useState<any[]>([]); // Add state for clientes
  const [servicios, setServicios] = useState<any[]>([]); // Add state for servicios

  // Cargar turnos, clientes y servicios desde la API
  useEffect(() => {
    // Fetch turnos
    fetch("http://localhost:3000/turnos")
      .then((res) => res.json())
      .then((data) => setTurnos(Array.isArray(data) ? data : []))
      .catch(() => setTurnos([]));

    // Fetch clientes
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]));

    // Fetch servicios
    fetch("http://localhost:3000/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(Array.isArray(data) ? data : []))
      .catch(() => setServicios([]));
  }, [showModal, showEditModal]); // reload when any modal closes

  // Function to handle edit button click
  const handleEditClick = (turno: any) => {
    setTurnoToEdit(turno);
    setShowEditModal(true);
  };

  // Function to reload data after a turno is edited
  const handleTurnoEditado = async () => {
    try {
      const res = await fetch("http://localhost:3000/turnos");
      const data = await res.json();
      setTurnos(Array.isArray(data) ? data : []);
      setShowEditModal(false);
      setTurnoToEdit(null);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    }
  };

  // --- DÍA ---
  // Solo selección de un día
  const fechaStr = selectedDate.toISOString().split("T")[0];
  const turnosDelDia = turnos.filter((t) => t.fecha === fechaStr);
  const fechaFormateada = selectedDate.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // Calendar change handler
  const onCalendarChange = (value: any) => {
    if (!value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
      return;
    }
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // --- SEMANA ---
  // Calcular inicio y fin de semana (domingo a sábado)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const getEndOfWeek = (date: Date) => {
    const d = getStartOfWeek(date);
    d.setDate(d.getDate() + 6);
    return d;
  };
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);
  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });
  // Turnos por día de la semana
  const turnosPorDiaSemana = diasSemana.map((dia) => {
    const fecha = dia.toISOString().split("T")[0];
    return turnos.filter((t) => t.fecha === fecha);
  });

  // Navegación de semanas
  const cambiarSemana = (delta: number) => {
    const nuevaFecha = new Date(startOfWeek);
    nuevaFecha.setDate(nuevaFecha.getDate() + delta * 7);
    setSelectedDate(nuevaFecha);
  };

  // Etiquetas de días
  const diasCorto = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

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
        <button
          className={`tab-btn${activeTab === "dia" ? " active" : ""}`}
          onClick={() => setActiveTab("dia")}
        >
          Día
        </button>
        <button
          className={`tab-btn${activeTab === "semana" ? " active" : ""}`}
          onClick={() => setActiveTab("semana")}
        >
          Semana
        </button>
      </div>
      {activeTab === "dia" && (
        <div className="turnos-dia-calendar-section">
          <div>
            <Calendar
              onChange={onCalendarChange}
              value={selectedDate}
              selectRange={false}
              maxDetail="month"
              minDetail="month"
              locale="es-AR"
              calendarType="iso8601"
              className="custom-calendar"
            />
          </div>
          <div>
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
                          <div className="turno-card-servicio">
                            {turno.servicio?.servicio || "-"}
                          </div>
                          <div className="turno-card-meta">
                            <span className="turno-card-hora">
                              <FaClock size={13} style={{ marginRight: 4, marginBottom: -2 }} />
                              {turno.hora
                                ? `${turno.hora.slice(0,5)} (Estimado)`
                                : "hh:mm (Estimado)"}
                            </span>
                            <span className="turno-card-cliente">
                              <FaUser size={13} style={{ marginRight: 4, marginBottom: -2 }} />
                              {turno.cliente?.nombre} {turno.cliente?.apellido}
                            </span>
                          </div>
                          {turno.notas && (
                            <div className="turno-card-notas">
                              <span>📝 {turno.notas}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="turno-card-actions">
                        <button className="turno-btn editar" onClick={() => handleEditClick(turno)}>
                          Editar
                        </button>
                        <button className="turno-btn cancelar">
                          Cancelar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === "semana" && (
        <>
          <div className="turnos-date-row">
            <button className="date-nav-btn" onClick={() => cambiarSemana(-1)}>
              &lt;
            </button>
            <span className="turnos-date-label">
              Semana del {startOfWeek.toLocaleDateString("es-AR")} al{" "}
              {endOfWeek.toLocaleDateString("es-AR")}
            </span>
            <button className="date-nav-btn" onClick={() => cambiarSemana(1)}>
              &gt;
            </button>
          </div>
          <div className="turnos-semana-list-section">
            {diasSemana.map((dia, idx) => (
              <div className="turnos-semana-dia-card" key={dia.toISOString()}>
                <div className="turnos-semana-dia-label">
                  {diasCorto[dia.getDay()]}
                </div>
                <div className="turnos-semana-dia-num">{dia.getDate()}</div>
                {turnosPorDiaSemana[idx].length === 0 ? (
                  <div className="turnos-semana-sin-turnos">Sin turnos</div>
                ) : (
                  <ul className="turnos-semana-turnos-list">
                    {turnosPorDiaSemana[idx].map((turno) => (
                      <li key={turno.id} className="turnos-semana-turno-item">
                        <span className="turnos-semana-turno-servicio">
                          {turno.servicio?.servicio || "-"}
                        </span>
                        <span className="turnos-semana-turno-hora">
                          {turno.hora}
                        </span>
                        <span className="turnos-semana-turno-cliente">
                          {turno.cliente?.nombre} {turno.cliente?.apellido}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <NuevoTurnoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTurnoCreado={async () => {
          const res = await fetch("http://localhost:3000/turnos");
          const data = await res.json();
          setTurnos(Array.isArray(data) ? data : []);
          setShowModal(false);
        }}
        clientes={clientes}
        servicios={servicios}
      />
      <EditarTurnoModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setTurnoToEdit(null);
        }}
        onTurnoEditado={handleTurnoEditado}
        turnoToEdit={turnoToEdit}
        clientes={clientes}
        servicios={servicios}
      />
    </div>
  );
}
