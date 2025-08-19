import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./calendar-dark.css";
import { FaPlus, FaClock, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import "./turno.css";
import NuevoTurnoModal from "./NuevoTurnoModal";
import EditarTurnoModal from "./EditarTurnoModal";
// import type { Value } from "react-calendar";

export default function Turnos() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [turnos, setTurnos] = useState<any[]>([]);
  const [turnoToEdit, setTurnoToEdit] = useState<any>(null); // State for the turno being edited
  // For calendar range selection (up to 2 days)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedRange, setSelectedRange] = useState<Date | [Date, Date]>(
    new Date()
  );
  const [activeTab, setActiveTab] = useState<"dia" | "semana" | "mes">("dia");
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
  // Calendar range logic
  const isRange = Array.isArray(selectedRange);
  let rangeStart: Date, rangeEnd: Date;
  if (isRange && selectedRange[0] && selectedRange[1]) {
    rangeStart = new Date(selectedRange[0]);
    rangeEnd = new Date(selectedRange[1]);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(0, 0, 0, 0);
  } else {
    rangeStart = new Date(selectedDate);
    rangeEnd = new Date(selectedDate);
  }

  // Get all dates in range
  const getDatesInRange = (start: Date, end: Date) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };
  const fechasSeleccionadas = getDatesInRange(rangeStart, rangeEnd);
  const turnosDelRango = turnos.filter((t) =>
    fechasSeleccionadas.includes(t.fecha)
  );
  // For label
  const fechaFormateada =
    isRange && selectedRange[0] && selectedRange[1]
      ? `${selectedRange[0].toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
        })} - ${selectedRange[1].toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`
      : selectedDate.toLocaleDateString("es-AR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  // Calendar change handler

  const onCalendarChange = (
    value: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!value) {
      // If value is null, reset to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedRange(today);
      setSelectedDate(today);
      return;
    }
    if (Array.isArray(value)) {
      const [start, end] = value;
      if (start instanceof Date && end instanceof Date) {
        setSelectedRange([start, end]);
        setSelectedDate(start);
      } else if (start instanceof Date) {
        setSelectedRange(start);
        setSelectedDate(start);
      }
    } else if (value instanceof Date) {
      setSelectedRange(value);
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
        <button
          className={`tab-btn${activeTab === "mes" ? " active" : ""}`}
          onClick={() => setActiveTab("mes")}
        >
          Mes
        </button>
      </div>
      {activeTab === "dia" && (
        <div
          className="turnos-dia-calendar-section"
          style={{
            display: "flex",
            gap: 32,
            alignItems: "flex-start",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 280, maxWidth: 340, flex: "0 0 320px" }}>
            <Calendar
              onChange={onCalendarChange}
              value={selectedRange}
              selectRange={true}
              maxDetail="month"
              minDetail="month"
              locale="es-AR"
              calendarType="iso8601"
            />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="turnos-date-row">
              <span className="turnos-date-label">
                {fechaFormateada.charAt(0).toUpperCase() +
                  fechaFormateada.slice(1)}
              </span>
            </div>
            <div className="turnos-list-section">
              {turnosDelRango.length === 0 ? (
                <div className="no-turnos-msg">
                  No hay turnos programados para este rango
                </div>
              ) : (
                <ul className="turnos-list">
                  {turnosDelRango.map((turno) => {
                    // Verificar si el turno es de una fecha pasada
                    const isPastDate = () => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const turnoDate = new Date(turno.fecha);
                      return turnoDate < today;
                    };

                    const isEditable = !isPastDate();

                    return (
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
                                <FaClock
                                  size={13}
                                  style={{ marginRight: 4, marginBottom: -2 }}
                                />
                                {turno.hora
                                  ? `${turno.hora} (Estimado)`
                                  : "hh:mm (Estimado)"}
                              </span>
                              <span className="turno-card-cliente">
                                <FaUser
                                  size={13}
                                  style={{ marginRight: 4, marginBottom: -2 }}
                                />
                                {turno.cliente?.nombre}{" "}
                                {turno.cliente?.apellido}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="turno-card-actions">
                          <button
                            className={`turno-btn editar ${
                              !isEditable ? "disabled" : ""
                            }`}
                            onClick={() => isEditable && handleEditClick(turno)}
                            disabled={!isEditable}
                            title={
                              !isEditable
                                ? "No se pueden editar turnos pasados"
                                : ""
                            }
                          >
                            <FaEdit style={{ marginRight: 4 }} /> Editar
                          </button>
                          <button className="turno-btn cancelar">
                            <FaTrash style={{ marginRight: 4 }} /> Cancelar
                          </button>
                        </div>
                      </li>
                    );
                  })}
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
