import React, { useState, useEffect } from "react";
import "./NuevoTurnoModal.css";
import { FaArrowLeft } from "react-icons/fa"; // Icono flecha para volver

export default function NuevoTurnoModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [cliente, setCliente] = useState("");
  const [servicio, setServicio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [clientes, setClientes] = useState<{ id: number; nombre: string; apellido: string }[]>([]);
  const [servicios, setServicios] = useState<{ id: number; servicio: string }[]>([]);

  useEffect(() => {
    if (show) {
      fetch("http://localhost:3000/clientes")
        .then(res => res.json())
        .then(data => setClientes(data))
        .catch(() => setClientes([]));
      fetch("http://localhost:3000/servicios")
        .then(res => res.json())
        .then(data => setServicios(data))
        .catch(() => setServicios([]));
    }
  }, [show]);

  if (!show) return null;

  const handleGuardar = async () => {
    const turno = {
      clienteId: Number(cliente),
      servicioId: Number(servicio),
      fecha,
      hora,
      notas,
    };

    try {
      const response = await fetch("http://localhost:3000/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno),
      });
      if (response.ok) {
        onClose();
      } else {
        alert("Error al guardar el turno");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* Encabezado con flecha y subtítulo */}
        <div className="modal-header">
          <FaArrowLeft className="back-arrow" onClick={onClose} />
          <div>
            <h2 className="modal-title">Nuevo Turno</h2>
            <p className="modal-subtitle">Agenda un nuevo turno para un cliente</p>
          </div>
        </div>

        {/* Contenedor del formulario */}
        <div className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label>Cliente</label>
              <select value={cliente} onChange={e => setCliente(e.target.value)}>
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Servicio</label>
              <select value={servicio} onChange={e => setServicio(e.target.value)}>
                <option value="">Seleccionar servicio</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.servicio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Notas adicionales</label>
            <textarea
              rows={2}
              placeholder="Agregar notas o preferencias del cliente..."
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button className="save-btn" onClick={handleGuardar}>Guardar Turno</button>
          </div>
        </div>

      </div>
    </div>
  );
}
