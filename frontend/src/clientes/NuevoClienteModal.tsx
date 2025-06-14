import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import "./NuevoClienteModal.css";

interface Props {
  show: boolean;
  onClose: () => void;
  onClienteCreado: () => void;
}

export default function NuevoClienteModal({ show, onClose, onClienteCreado }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    dni: "",
    fechaNacimiento: "",
    activo: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        alert("Error al crear el cliente. Verifica los datos o el servidor.");
        return;
      }
      onClienteCreado();
      onClose();
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-bg">
      <div className="nuevo-cliente-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Nuevo Cliente</h2>
        <p className="modal-subtitle">Agrega un nuevo cliente a tu peluquería</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>Nombre</label>
              <input name="nombre" placeholder="Ej: María" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="nuevo-input-group">
              <label>Apellido</label>
              <input name="apellido" placeholder="Ej: García" value={form.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="nuevo-input-group input-icon-group">
            <label>Teléfono</label>
            <div className="input-icon-row">
              <FaPhoneAlt className="input-icon" />
              <input
                name="telefono"
                placeholder="Ej: 11-1234-5678"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="nuevo-input-group input-icon-group">
            <label>Email</label>
            <div className="input-icon-row">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                placeholder="Ej: cliente@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>DNI</label>
              <input name="dni" placeholder="Ej: 12345678" value={form.dni} onChange={handleChange} required />
            </div>
            <div className="nuevo-input-group input-icon-group">
              <label>Fecha de nacimiento</label>
              <div className="input-icon-row">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="text"
                  name="fechaNacimiento"
                  placeholder="dd/mm/aaaa"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  pattern="\d{2}/\d{2}/\d{4}"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
          <div className="estado-row">
            <div>
              <label className="estado-label">Estado del cliente</label>
              <div className="switch-desc">Cliente activo puede agendar turnos</div>
            </div>
            <label className="switch">
              <input type="checkbox" 
              name="activo" 
              checked={true} 
              disabled
              readOnly />
              <span className="slider"></span>
            </label>
          </div>
          <div className="form-row buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="create-btn">Crear cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
}