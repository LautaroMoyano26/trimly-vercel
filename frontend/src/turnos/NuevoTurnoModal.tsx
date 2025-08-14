import React, { useState } from "react";
import "./NuevoTurnoModal.css";
import { FaArrowLeft } from "react-icons/fa";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
}

interface Servicio {
  id: number;
  servicio: string;
}

interface NuevoTurnoModalProps {
  show: boolean;
  onClose: () => void;
  onTurnoCreado: () => Promise<void>;
  clientes: Cliente[];
  servicios: Servicio[];
}

export default function NuevoTurnoModal({
  show,
  onClose,
  onTurnoCreado,
  clientes,
  servicios
}: NuevoTurnoModalProps) {
  const [cliente, setCliente] = useState("");
  const [servicio, setServicio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  
  const resetForm = () => {
    setCliente("");
    setServicio("");
    setFecha("");
    setHora("");
    setNotas("");
  };

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
        await onTurnoCreado(); 
        resetForm();
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

        {/* Encabezado */}
        <div className="modal-header">
          <FaArrowLeft className="back-arrow" onClick={onClose} />
          <div>
            <h2 className="modal-title">Nuevo Turno</h2>
            <p className="modal-subtitle">Agenda un nuevo turno para un cliente</p>
          </div>
        </div>

        {/* Formulario */}
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
