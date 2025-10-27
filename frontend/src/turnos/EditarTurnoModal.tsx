// Modificar: frontend/src/turnos/EditarTurnoModal.tsx
import React, { useState, useEffect, useRef } from "react";
import "./EditarTurnoModal.css";
import SuccessModal from "../components/SuccessModal";
import { FaPlus, FaTimes, FaUser } from "react-icons/fa";
import NuevoClienteModal from "../clientes/NuevoClienteModal";
import NuevoServicioModal from "../servicios/NuevoServicioModal";
import NuevoUsuarioModal from "../usuarios/NuevoUsuarioModal";
import { API_URL } from "../config/api";

interface Turno {
  id: number;
  clienteId: number;
  servicioId: number;
  usuarioId?: number;
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
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  activo: boolean;
  telefono?: string;
  dni?: string;
}

interface Servicio {
  id: number;
  servicio: string;
  precio?: number;
  duracion?: number;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  activo: boolean;
  rol: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  onTurnoEditado: () => Promise<void>;
  turnoToEdit?: Turno;
  clientes: Cliente[];
  servicios: Servicio[];
  usuarios: Usuario[];
}

export default function EditarTurnoModal({
  show,
  onClose,
  onTurnoEditado,
  turnoToEdit,
  clientes,
  servicios,
  usuarios,
}: Props) {
  // Estados del formulario original (mantener)
  const [form, setForm] = useState({
    clienteId: "",
    servicioId: "",
    usuarioId: "",
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

  // ✅ NUEVOS ESTADOS PARA BÚSQUEDAS (sin afectar el formulario original)
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [mostrarDropdownClientes, setMostrarDropdownClientes] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const clienteSearchRef = useRef<HTMLDivElement>(null);

  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] =
    useState<Servicio | null>(null);
  const [mostrarDropdownServicios, setMostrarDropdownServicios] =
    useState(false);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([]);
  const servicioSearchRef = useRef<HTMLDivElement>(null);

  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [mostrarDropdownUsuarios, setMostrarDropdownUsuarios] = useState(false);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const usuarioSearchRef = useRef<HTMLDivElement>(null);

  // Estados para modales de creación
  const [showNuevoClienteModal, setShowNuevoClienteModal] = useState(false);
  const [showNuevoServicioModal, setShowNuevoServicioModal] = useState(false);
  const [showNuevoUsuarioModal, setShowNuevoUsuarioModal] = useState(false);

  // Funciones originales (mantener sin cambios)
  const isPastDate = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateStr.split("-").map(Number);
    const checkDate = new Date(year, month - 1, day);
    return checkDate.getTime() < today.getTime();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
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
    if (!form.usuarioId) return "Debes seleccionar un profesional";
    if (!form.fecha) return "Debes seleccionar una fecha";
    if (isPastDate(form.fecha))
      return "No se pueden editar turnos para fechas anteriores a hoy";
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
      usuarioId: Number(form.usuarioId),
      ...(form.notas ? { notas: form.notas } : {}),
    };

    try {
      const res = await fetch(`${API_URL}/turnos/${turnoToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al editar el turno.");
      }
      setSuccessModal({ show: true, message: "Turno editado correctamente" });
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

  // ✅ NUEVAS FUNCIONES PARA LAS BÚSQUEDAS
  const buscarPorInicioDepalabras = (
    texto: string,
    termino: string
  ): boolean => {
    if (!termino.trim()) return false;
    const textoLimpio = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const terminoLimpio = termino
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const palabras = textoLimpio.split(/\s+/);
    return palabras.some((palabra) => palabra.startsWith(terminoLimpio));
  };

  // Filtros para las búsquedas
  useEffect(() => {
    if (!busquedaCliente.trim()) {
      setClientesFiltrados([]);
      setMostrarDropdownClientes(false);
      return;
    }

    const filtrados = clientes
      .filter((c) => c.activo)
      .filter((cliente) => {
        const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`;
        return (
          buscarPorInicioDepalabras(nombreCompleto, busquedaCliente) ||
          buscarPorInicioDepalabras(cliente.dni || "", busquedaCliente) ||
          buscarPorInicioDepalabras(cliente.telefono || "", busquedaCliente)
        );
      })
      .slice(0, 5);

    setClientesFiltrados(filtrados);
    setMostrarDropdownClientes(filtrados.length > 0);
  }, [busquedaCliente, clientes]);

  useEffect(() => {
    if (!busquedaServicio.trim()) {
      setServiciosFiltrados([]);
      setMostrarDropdownServicios(false);
      return;
    }

    const filtrados = servicios
      .filter((servicio) =>
        buscarPorInicioDepalabras(servicio.servicio, busquedaServicio)
      )
      .slice(0, 5);

    setServiciosFiltrados(filtrados);
    setMostrarDropdownServicios(filtrados.length > 0);
  }, [busquedaServicio, servicios]);

  useEffect(() => {
    if (!busquedaUsuario.trim()) {
      setUsuariosFiltrados([]);
      setMostrarDropdownUsuarios(false);
      return;
    }

    const filtrados = usuarios
      .filter((u) => u.activo && (u.rol === "empleado" || u.rol === "admin"))
      .filter((usuario) => {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
        return buscarPorInicioDepalabras(nombreCompleto, busquedaUsuario);
      })
      .slice(0, 5);

    setUsuariosFiltrados(filtrados);
    setMostrarDropdownUsuarios(filtrados.length > 0);
  }, [busquedaUsuario, usuarios]);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clienteSearchRef.current &&
        !clienteSearchRef.current.contains(event.target as Node)
      ) {
        setMostrarDropdownClientes(false);
      }
      if (
        servicioSearchRef.current &&
        !servicioSearchRef.current.contains(event.target as Node)
      ) {
        setMostrarDropdownServicios(false);
      }
      if (
        usuarioSearchRef.current &&
        !usuarioSearchRef.current.contains(event.target as Node)
      ) {
        setMostrarDropdownUsuarios(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Funciones para seleccionar elementos
  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(`${cliente.nombre} ${cliente.apellido}`);
    setMostrarDropdownClientes(false);
    setForm((prev) => ({ ...prev, clienteId: cliente.id.toString() }));
    setError(null);
  };

  const seleccionarServicio = (servicio: Servicio) => {
    setServicioSeleccionado(servicio);
    setBusquedaServicio(servicio.servicio);
    setMostrarDropdownServicios(false);
    setForm((prev) => ({ ...prev, servicioId: servicio.id.toString() }));
    setError(null);
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setBusquedaUsuario(`${usuario.nombre} ${usuario.apellido}`);
    setMostrarDropdownUsuarios(false);
    setForm((prev) => ({ ...prev, usuarioId: usuario.id.toString() }));
    setError(null);
  };

  // ✅ EFECTO PARA CARGAR DATOS DEL TURNO (actualizado para sincronizar búsquedas)
  useEffect(() => {
    if (show && turnoToEdit) {
      if (isPastDate(turnoToEdit.fecha)) {
        setError("No se pueden editar turnos de fechas pasadas.");
        return;
      }

      // Cargar datos del formulario (mantener original)
      setForm({
        clienteId: String(turnoToEdit.clienteId),
        servicioId: String(turnoToEdit.servicioId),
        usuarioId: turnoToEdit.usuarioId
          ? String(turnoToEdit.usuarioId)
          : turnoToEdit.usuario
          ? String(turnoToEdit.usuario.id)
          : "",
        fecha: turnoToEdit.fecha.split("T")[0],
        hora: turnoToEdit.hora,
        notas: turnoToEdit.notas || "",
      });

      // ✅ SINCRONIZAR BÚSQUEDAS CON DATOS EXISTENTES
      const clienteExistente = clientes.find(
        (c) => c.id === turnoToEdit.clienteId
      );
      if (clienteExistente) {
        setClienteSeleccionado(clienteExistente);
        setBusquedaCliente(
          `${clienteExistente.nombre} ${clienteExistente.apellido}`
        );
      }

      const servicioExistente = servicios.find(
        (s) => s.id === turnoToEdit.servicioId
      );
      if (servicioExistente) {
        setServicioSeleccionado(servicioExistente);
        setBusquedaServicio(servicioExistente.servicio);
      }

      const usuarioId = turnoToEdit.usuarioId || turnoToEdit.usuario?.id;
      const usuarioExistente = usuarios.find((u) => u.id === usuarioId);
      if (usuarioExistente) {
        setUsuarioSeleccionado(usuarioExistente);
        setBusquedaUsuario(
          `${usuarioExistente.nombre} ${usuarioExistente.apellido}`
        );
      }

      setError(null);
    }
  }, [show, turnoToEdit, clientes, servicios, usuarios]);

  // Funciones para modales de creación
  const handleClienteCreado = async () => {
    await onTurnoEditado();
    setShowNuevoClienteModal(false);
  };

  const handleServicioCreado = async () => {
    await onTurnoEditado();
    setShowNuevoServicioModal(false);
  };

  const handleUsuarioCreado = async () => {
    await onTurnoEditado();
    setShowNuevoUsuarioModal(false);
  };

  // Renderizado para fechas pasadas (mantener original)
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
            {/* ✅ BÚSQUEDA DE CLIENTE - SIN RECUADRO DE INFO EXTRA */}
            <div className="editar-turno-form-group">
              <label>Cliente</label>
              <div className="search-wrapper" ref={clienteSearchRef}>
                <div className="search-container-with-external-buttons">
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre, DNI, teléfono..."
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    onFocus={() =>
                      busquedaCliente &&
                      setMostrarDropdownClientes(clientesFiltrados.length > 0)
                    }
                    className="search-input-clean"
                  />
                  <div className="external-buttons">
                    {clienteSeleccionado && (
                      <button
                        type="button"
                        className="clear-btn-external"
                        onClick={() => {
                          setClienteSeleccionado(null);
                          setBusquedaCliente("");
                          setForm((prev) => ({ ...prev, clienteId: "" }));
                        }}
                        title="Limpiar selección"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      type="button"
                      className="add-btn-external"
                      onClick={() => setShowNuevoClienteModal(true)}
                      title="Agregar nuevo cliente"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Dropdown - MANTENER */}
                {mostrarDropdownClientes && clientesFiltrados.length > 0 && (
                  <div className="search-dropdown">
                    {clientesFiltrados.map((cliente) => (
                      <div
                        key={cliente.id}
                        className="dropdown-item"
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <div className="item-info-simple">
                          <div className="item-details">
                            <span className="item-name">
                              {cliente.nombre} {cliente.apellido}
                            </span>
                            <span className="item-meta">
                              {cliente.dni && `DNI: ${cliente.dni}`}
                              {cliente.dni && cliente.telefono && " | "}
                              {cliente.telefono && `Tel: ${cliente.telefono}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ ELIMINAR ESTE BLOQUE COMPLETO - selected-item */}
                {/* 
                {clienteSeleccionado && (
                  <div className="selected-item">
                    <div className="selected-info-simple">
                      <div className="selected-details">
                        <span className="selected-name">
                          ✓ {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                        </span>
                        <span className="selected-meta">
                          {clienteSeleccionado.dni && `DNI: ${clienteSeleccionado.dni}`}
                          {clienteSeleccionado.dni && clienteSeleccionado.telefono && " | "}
                          {clienteSeleccionado.telefono && `Tel: ${clienteSeleccionado.telefono}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                */}
              </div>
            </div>

            {/* ✅ BÚSQUEDA DE SERVICIO - SIN RECUADRO DE INFO EXTRA */}
            <div className="editar-turno-form-group">
              <label>Servicio</label>
              <div className="search-wrapper" ref={servicioSearchRef}>
                <div className="search-container-with-external-buttons">
                  <input
                    type="text"
                    placeholder="Buscar servicio..."
                    value={busquedaServicio}
                    onChange={(e) => setBusquedaServicio(e.target.value)}
                    onFocus={() =>
                      busquedaServicio &&
                      setMostrarDropdownServicios(serviciosFiltrados.length > 0)
                    }
                    className="search-input-clean"
                  />
                  <div className="external-buttons">
                    {servicioSeleccionado && (
                      <button
                        type="button"
                        className="clear-btn-external"
                        onClick={() => {
                          setServicioSeleccionado(null);
                          setBusquedaServicio("");
                          setForm((prev) => ({ ...prev, servicioId: "" }));
                        }}
                        title="Limpiar selección"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      type="button"
                      className="add-btn-external"
                      onClick={() => setShowNuevoServicioModal(true)}
                      title="Agregar nuevo servicio"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Dropdown - MANTENER */}
                {mostrarDropdownServicios && serviciosFiltrados.length > 0 && (
                  <div className="search-dropdown">
                    {serviciosFiltrados.map((servicio) => (
                      <div
                        key={servicio.id}
                        className="dropdown-item"
                        onClick={() => seleccionarServicio(servicio)}
                      >
                        <div className="item-info-simple">
                          <div className="item-details">
                            <span className="item-name">
                              {servicio.servicio}
                            </span>
                            <span className="item-meta">
                              {servicio.precio && `$${servicio.precio}`}
                              {servicio.precio && servicio.duracion && " | "}
                              {servicio.duracion && `${servicio.duracion} min`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ ELIMINAR ESTE BLOQUE COMPLETO - selected-item */}
                {/* 
                {servicioSeleccionado && (
                  <div className="selected-item">
                    <div className="selected-info-simple">
                      <div className="selected-details">
                        <span className="selected-name">
                          ✓ {servicioSeleccionado.servicio}
                        </span>
                        <span className="selected-meta">
                          {servicioSeleccionado.precio && `$${servicioSeleccionado.precio}`}
                          {servicioSeleccionado.precio && servicioSeleccionado.duracion && " | "}
                          {servicioSeleccionado.duracion && `${servicioSeleccionado.duracion} min`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                */}
              </div>
            </div>

            {/* ✅ BÚSQUEDA DE USUARIO - SIN RECUADRO DE INFO EXTRA */}
            <div className="editar-turno-form-group">
              <label>Profesional asignado</label>
              <div className="search-wrapper" ref={usuarioSearchRef}>
                <div className="search-container-with-external-buttons">
                  <input
                    type="text"
                    placeholder="Buscar profesional..."
                    value={busquedaUsuario}
                    onChange={(e) => setBusquedaUsuario(e.target.value)}
                    onFocus={() =>
                      busquedaUsuario &&
                      setMostrarDropdownUsuarios(usuariosFiltrados.length > 0)
                    }
                    className="search-input-clean"
                  />
                  <div className="external-buttons">
                    {usuarioSeleccionado && (
                      <button
                        type="button"
                        className="clear-btn-external"
                        onClick={() => {
                          setUsuarioSeleccionado(null);
                          setBusquedaUsuario("");
                          setForm((prev) => ({ ...prev, usuarioId: "" }));
                        }}
                        title="Limpiar selección"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      type="button"
                      className="add-btn-external"
                      onClick={() => setShowNuevoUsuarioModal(true)}
                      title="Agregar nuevo profesional"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Dropdown - MANTENER */}
                {mostrarDropdownUsuarios && usuariosFiltrados.length > 0 && (
                  <div className="search-dropdown">
                    {usuariosFiltrados.map((usuario) => (
                      <div
                        key={usuario.id}
                        className="dropdown-item"
                        onClick={() => seleccionarUsuario(usuario)}
                      >
                        <div className="item-info-simple">
                          <div className="item-details">
                            <span className="item-name">
                              {usuario.nombre} {usuario.apellido}
                            </span>
                            <span className="item-meta">
                              {usuario.rol === "admin"
                                ? "Administrador"
                                : "Empleado"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ ELIMINAR ESTE BLOQUE COMPLETO - selected-item */}
                {/* 
                {usuarioSeleccionado && (
                  <div className="selected-item">
                    <div className="selected-info-simple">
                      <div className="selected-details">
                        <span className="selected-name">
                          ✓ {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                        </span>
                        <span className="selected-meta">
                          {usuarioSeleccionado.rol === "admin" ? "Administrador" : "Empleado"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                */}
              </div>
            </div>

            {/* CAMPOS ORIGINALES (mantener sin cambios) */}
            <div className="editar-turno-form-row">
              <div className="editar-turno-form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  min={new Date().toISOString().split("T")[0]}
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

      {/* Modales de creación */}
      <NuevoClienteModal
        show={showNuevoClienteModal}
        onClose={() => setShowNuevoClienteModal(false)}
        onClienteCreado={handleClienteCreado}
      />

      <NuevoServicioModal
        show={showNuevoServicioModal}
        onClose={() => setShowNuevoServicioModal(false)}
        onServicioCreado={handleServicioCreado}
      />

      <NuevoUsuarioModal
        show={showNuevoUsuarioModal}
        onClose={() => setShowNuevoUsuarioModal(false)}
        onUsuarioCreado={handleUsuarioCreado}
      />

      <SuccessModal
        show={successModal.show}
        message={successModal.message}
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
