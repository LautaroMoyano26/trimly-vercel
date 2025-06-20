import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import "./EditarClienteModal.css";

// 1. SOLUCIÓN PARA 'Cliente': Define la interfaz Cliente al principio del archivo
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
  fechaNacimiento?: string; // Es opcional ya que es nullable en la entidad
  activo: boolean;
}

interface Props {
  show: boolean;
  onClose: () => void;
  onClienteEditado: () => Promise<void>; // Aseguramos que el tipo acepte async
  clienteToEdit?: Cliente;
}

export default function EditarClienteModal({
  show,
  onClose,
  onClienteEditado,
  clienteToEdit,
}: Props) {
  // Inicializamos el formulario con los datos del cliente a editar, si existe.
  const [form, setForm] = useState<Partial<Cliente>>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    dni: "",
    fechaNacimiento: "",
    activo: true,
  });

  // Usamos useEffect para cargar los datos del cliente cuando la modal se abre o el clienteToEdit cambia
  useEffect(() => {
    if (show && clienteToEdit) {
      setForm({
        // NO INCLUIMOS EL ID EN EL ESTADO DEL FORMULARIO SI NO VA A SER ENVIADO EN EL BODY
        // id: clienteToEdit.id, // <--- ELIMINA O COMENTA ESTA LÍNEA
        nombre: clienteToEdit.nombre,
        apellido: clienteToEdit.apellido,
        telefono: clienteToEdit.telefono,
        email: clienteToEdit.email,
        dni: clienteToEdit.dni,
        fechaNacimiento: clienteToEdit.fechaNacimiento
          ? new Date(clienteToEdit.fechaNacimiento).toISOString().split("T")[0]
          : "",
        activo: clienteToEdit.activo,
      });
    } else if (show && !clienteToEdit) {
      // Si se abre la modal sin clienteToEdit, la inicializamos vacía (para "crear")
      setForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        dni: "",
        fechaNacimiento: "",
        activo: true,
      });
    }
  }, [show, clienteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = clienteToEdit !== undefined; // Usa clienteToEdit para determinar si es edición
    const url = isEditing
      ? `http://localhost:3000/clientes/${clienteToEdit!.id}` // Usamos clienteToEdit.id aquí
      : "http://localhost:3000/clientes";
    const method = isEditing ? "PATCH" : "POST";

    // --- Validación de email en el frontend ---
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert(
        "Por favor, ingresa un formato de email válido (ej. ejemplo@dominio.com)."
      );
      return; // Detiene el envío si el email es inválido
    }

    // --- CONSTRUCCIÓN DEL OBJETO DE DATOS PARA EL BODY ---
    // Creamos un nuevo objeto 'dataToSend' para asegurarnos de que no incluya 'id' para PATCH
    const { id, ...dataToSend } = form; // Extrae 'id' y el resto de las propiedades
    // Si estás editando y el ID no debe ir en el cuerpo, el 'id' se descarta aquí.
    // Si es una creación, 'id' será undefined y no se incluirá de todos modos.

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend), // <-- ¡Usamos dataToSend, que NO tiene el ID!
      });

      if (!res.ok) {
        // Mejor manejo de errores: intenta leer el mensaje de error del backend
        const errorData = await res.json();
        alert(
          `Error al ${isEditing ? "editar" : "crear"} el cliente: ${
            errorData.message || "Error desconocido"
          }.`
        );
        console.error("Detalles del error del backend:", errorData);
        return;
      }

      onClienteEditado(); // Llamamos a la función de éxito para recargar la lista
      onClose(); // Cerramos el modal
    } catch (error) {
      console.error("Error en la conexión con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-bg">
      <div className="editar-cliente-modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">
          {clienteToEdit ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>
        <p className="modal-subtitle">
          {clienteToEdit
            ? "Editar los datos del cliente"
            : "Ingresar los datos del nuevo cliente"}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>Nombre</label>
              <input
                name="nombre"
                placeholder="Ej: María"
                value={form.nombre || ""} // Añadir || "" para evitar undefined
                onChange={handleChange}
                required
              />
            </div>
            <div className="nuevo-input-group">
              <label>Apellido</label>
              <input
                name="apellido"
                placeholder="Ej: García"
                value={form.apellido || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="nuevo-input-group input-icon-group">
            <label>Teléfono</label>
            <div className="input-icon-row">
              <FaPhoneAlt className="input-icon" />
              <input
                name="telefono"
                placeholder="Ej: 11-1234-5678"
                value={form.telefono || ""}
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
                type="email" // Usar type="email" para validación básica del navegador
                placeholder="Ej: cliente@email.com"
                value={form.email || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>DNI</label>
              <input
                name="dni"
                placeholder="Ej: 12345678"
                value={form.dni || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="nuevo-input-group input-icon-group">
              <label>Fecha de nacimiento</label>
              <div className="input-icon-row">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  name="fechaNacimiento"
                  placeholder="aaaa-mm-dd"
                  value={form.fechaNacimiento || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="estado-row">
            <div>
              <label className="estado-label">Estado del cliente</label>
              <div className="switch-desc">
                Cliente activo puede agendar turnos
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo ?? true} // Usar ?? true para asegurar un valor inicial
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="form-row buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="create-btn">
              {clienteToEdit ? "Guardar cambios" : "Crear cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
