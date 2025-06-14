import React, { useState } from "react";
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
        // Puedes mostrar un mensaje de error al usuario aquí
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
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Nuevo Cliente</h2>
        <p>Agrega un nuevo cliente a tu peluquería</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="nombre" placeholder="Ej: María" value={form.nombre} onChange={handleChange} required />
            <input name="apellido" placeholder="Ej: García" value={form.apellido} onChange={handleChange} required />
          </div>
          <input name="telefono" placeholder="Ej: 11-1234-5678" value={form.telefono} onChange={handleChange} required />
          <input name="email" placeholder="Ej: cliente@email.com" value={form.email} onChange={handleChange} required />
          <div className="form-row">
            <input name="dni" placeholder="Ej: 12345678" value={form.dni} onChange={handleChange} required />
            <input
              type="date"
              name="fechaNacimiento"
              placeholder="aaaa-mm-dd"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="form-row switch-row">
            <label>
              Estado del cliente
              <span className="switch-desc">Cliente activo puede agendar turnos</span>
            </label>
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
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