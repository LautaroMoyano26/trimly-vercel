import React, { useState, useEffect } from "react";
import "./EditarTurnoModal.css";
import SuccessModal from "../components/SuccessModal";

interface Turno {
  id: number;
  clienteId: number;
  servicioId: number;
  fecha: string;
  hora: string;
  notas?: string;
  cliente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  servicio?: {
    id: number;
    servicio: string;
  };
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  activo: boolean;
}

interface Servicio {
  id: number;
  servicio: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  onTurnoEditado: () => Promise<void>;
  turnoToEdit?: Turno;
  clientes: Cliente[];
  servicios: Servicio[];
}

export default function EditarTurnoModal({
  show,
  onClose,
  onTurnoEditado,
  turnoToEdit,
  clientes,
  servicios,
}: Props) {
  const [form, setForm] = useState({
    clienteId: "",
    servicioId: "",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // Función para verificar si una fecha es anterior a hoy (no incluye el día actual)
  const isPastDate = (dateStr: string): boolean => {
    // Obtenemos la fecha actual y la configuramos a las 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convertimos la cadena de fecha a componentes de año, mes y día
    // para evitar problemas de zona horaria
    const [year, month, day] = dateStr.split("-").map(Number);

    // Creamos una nueva fecha usando los componentes
    // Nota: en JavaScript, los meses van de 0 a 11, por eso restamos 1 al mes
    const checkDate = new Date(year, month - 1, day);

    // Comparamos los timestamps para mayor precisión
    return checkDate.getTime() < today.getTime();
  };

  useEffect(() => {
    if (show && turnoToEdit) {
      // Verificar si el turno es de una fecha pasada
      if (isPastDate(turnoToEdit.fecha)) {
        setError("No se pueden editar turnos de fechas pasadas.");
        return;
      }

      setForm({
        clienteId: String(turnoToEdit.clienteId),
        servicioId: String(turnoToEdit.servicioId),
        fecha: turnoToEdit.fecha.split("T")[0],
        hora: turnoToEdit.hora,
        notas: turnoToEdit.notas || "",
      });
      setError(null);
    }
  }, [show, turnoToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Validar fecha si está cambiando ese campo
    if (name === "fecha" && isPastDate(value)) {
      setError("No se pueden programar turnos en fechas anteriores a hoy.");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!form.clienteId) return "Debes seleccionar un cliente";
    if (!form.servicioId) return "Debes seleccionar un servicio";
    if (!form.fecha) return "Debes seleccionar una fecha";

    // Validar que la fecha no sea pasada
    if (isPastDate(form.fecha)) {
      return "No se pueden editar turnos para fechas anteriores a hoy";
    }

    if (!form.hora) return "Debes seleccionar una hora";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (!turnoToEdit) return;
    setIsSubmitting(true);

    const dataToSend = {
      ...form,
      clienteId: Number(form.clienteId),
      servicioId: Number(form.servicioId),
      // Only send notas if it's not empty
      ...(form.notas ? { notas: form.notas } : {}),
    };

    try {
      const res = await fetch(
        `http://localhost:3000/turnos/${turnoToEdit.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al editar el turno.");
      }

      setSuccessModal({
        show: true,
        message: "Turno editado correctamente",
      });
    } catch (error: any) {
      setError(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = async () => {
    setSuccessModal({ show: false, message: "" });
    await onTurnoEditado();
    onClose();
  };

  // Si el turno es de una fecha pasada, mostrar solo el mensaje de error
  if (show && turnoToEdit && isPastDate(turnoToEdit.fecha)) {
    return (
      <div className="editar-turno-overlay">
        <div className="editar-turno-modal-content">
          <button className="editar-turno-close-btn" onClick={onClose}>
            ×
          </button>
          <h2 className="editar-turno-title">No se puede editar</h2>
          <p className="editar-turno-subtitle">
            No es posible editar turnos de fechas anteriores a hoy.
          </p>
          <div className="editar-turno-actions">
            <button
              type="button"
              className="editar-turno-save-btn"
              onClick={onClose}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!show) return null;

  return (
    <>
      <div className="editar-turno-overlay">
        <div className="editar-turno-modal-content">
          <button className="editar-turno-close-btn" onClick={onClose}>
            ×
          </button>
          <h2 className="editar-turno-title">Editar Turno</h2>
          <p className="editar-turno-subtitle">
            Modifica los detalles del turno seleccionado.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="editar-turno-form-group">
              <label>Cliente</label>
              <select
                name="clienteId"
                value={form.clienteId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Seleccionar cliente
                </option>
                {clientes
                  .filter((c) => c.activo !== false) // Solo mostrar clientes activos
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
              </select>
            </div>
            <div className="editar-turno-form-group">
              <label>Servicio</label>
              <select
                name="servicioId"
                value={form.servicioId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Seleccionar servicio
                </option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.servicio}
                  </option>
                ))}
              </select>
            </div>
            <div className="editar-turno-form-row">
              <div className="editar-turno-form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  min={new Date().toISOString().split("T")[0]} // Esto ya permite desde hoy correctamente
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="editar-turno-form-group">
                <label>Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="editar-turno-form-group">
              <label>Notas (Opcional)</label>
              <textarea
                name="notas"
                placeholder="Notas adicionales sobre el turno..."
                value={form.notas}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {error && <p className="editar-turno-error-message">{error}</p>}

            <div className="editar-turno-actions">
              <button
                type="button"
                className="editar-turno-cancel-btn"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="editar-turno-save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        show={successModal.show}
        message={successModal.message}
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
