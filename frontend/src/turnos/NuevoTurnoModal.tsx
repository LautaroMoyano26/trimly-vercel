import { useState, useEffect, useRef } from "react";
import "./NuevoTurnoModal.css";
import { FaArrowLeft, FaClock, FaPlus, FaUser } from "react-icons/fa";
import SuccessModal from "../components/SuccessModal";
import NuevoClienteModal from "../clientes/NuevoClienteModal";
import NuevoServicioModal from "../servicios/NuevoServicioModal";
import NuevoUsuarioModal from "../usuarios/NuevoUsuarioModal";
import { API_URL } from "../config/api";

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
  estado: boolean;
  precio?: number;
  duracion?: number;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  activo: boolean;
}

interface NuevoTurnoModalProps {
  show: boolean;
  onClose: () => void;
  onTurnoCreado: () => Promise<void>;
  clientes: Cliente[];
  servicios: Servicio[];
  usuarios: Usuario[];
}

export default function NuevoTurnoModal({
  show,
  onClose,
  onTurnoCreado,
  clientes,
  servicios,
  usuarios,
}: NuevoTurnoModalProps) {
  // Estados existentes
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [servicio, setServicio] = useState("");
  const [usuario, setUsuario] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const timeSelectorRef = useRef<HTMLDivElement>(null);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // ✅ ESTADOS PARA BÚSQUEDA DE CLIENTE (YA EXISTENTES)
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [mostrarDropdownClientes, setMostrarDropdownClientes] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const clienteSearchRef = useRef<HTMLDivElement>(null);

  // ✅ NUEVOS ESTADOS PARA BÚSQUEDA DE SERVICIO
  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] =
    useState<Servicio | null>(null);
  const [mostrarDropdownServicios, setMostrarDropdownServicios] =
    useState(false);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([]);
  const servicioSearchRef = useRef<HTMLDivElement>(null);

  // ✅ NUEVOS ESTADOS PARA BÚSQUEDA DE USUARIO/PROFESIONAL
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

  // ✅ FUNCIÓN HELPER PARA BÚSQUEDA INTELIGENTE
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

    // Dividir el texto en palabras
    const palabras = textoLimpio.split(/\s+/);

    // Verificar si alguna palabra comienza con el término
    return palabras.some((palabra) => palabra.startsWith(terminoLimpio));
  };

  // ✅ ACTUALIZAR EFECTO PARA FILTRAR CLIENTES (REEMPLAZAR EL EXISTENTE)
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
        const termino = busquedaCliente;

        return (
          buscarPorInicioDepalabras(nombreCompleto, termino) ||
          buscarPorInicioDepalabras(cliente.dni || "", termino) ||
          buscarPorInicioDepalabras(cliente.telefono || "", termino)
        );
      })
      .slice(0, 5);

    setClientesFiltrados(filtrados);
    setMostrarDropdownClientes(filtrados.length > 0);
  }, [busquedaCliente, clientes]);

  // ✅ ACTUALIZAR EFECTO PARA FILTRAR SERVICIOS (REEMPLAZAR EL EXISTENTE)
  useEffect(() => {
    if (!busquedaServicio.trim()) {
      setServiciosFiltrados([]);
      setMostrarDropdownServicios(false);
      return;
    }

    const filtrados = servicios
      .filter((s) => s.estado)
      .filter((servicio) => {
        return buscarPorInicioDepalabras(servicio.servicio, busquedaServicio);
      })
      .slice(0, 5);

    setServiciosFiltrados(filtrados);
    setMostrarDropdownServicios(filtrados.length > 0);
  }, [busquedaServicio, servicios]);

  // ✅ ACTUALIZAR EFECTO PARA FILTRAR USUARIOS (REEMPLAZAR EL EXISTENTE)
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

  // ✅ CERRAR DROPDOWNS AL HACER CLICK FUERA (ACTUALIZADO)
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
      if (
        timeSelectorRef.current &&
        !timeSelectorRef.current.contains(event.target as Node)
      ) {
        setShowTimeSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ FUNCIÓN PARA SELECCIONAR CLIENTE (YA EXISTENTE)
  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setClienteId(cliente.id);
    setBusquedaCliente(`${cliente.nombre} ${cliente.apellido}`);
    setMostrarDropdownClientes(false);
    if (errores.cliente) {
      setErrores((prev) => ({ ...prev, cliente: "" }));
    }
  };

  // ✅ NUEVA FUNCIÓN PARA SELECCIONAR SERVICIO
  const seleccionarServicio = (servicioObj: Servicio) => {
    setServicioSeleccionado(servicioObj);
    setServicio(servicioObj.id.toString());
    setBusquedaServicio(servicioObj.servicio);
    setMostrarDropdownServicios(false);
    if (errores.servicio) {
      setErrores((prev) => ({ ...prev, servicio: "" }));
    }
  };

  // ✅ NUEVA FUNCIÓN PARA SELECCIONAR USUARIO
  const seleccionarUsuario = (usuarioObj: Usuario) => {
    setUsuarioSeleccionado(usuarioObj);
    setUsuario(usuarioObj.id.toString());
    setBusquedaUsuario(`${usuarioObj.nombre} ${usuarioObj.apellido}`);
    setMostrarDropdownUsuarios(false);
    if (errores.usuario) {
      setErrores((prev) => ({ ...prev, usuario: "" }));
    }
  };

  // ✅ FUNCIÓN PARA LIMPIAR SELECCIÓN DE CLIENTE (YA EXISTENTE)
  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    setClienteId(null);
    setBusquedaCliente("");
    setMostrarDropdownClientes(false);
  };

  // ✅ NUEVA FUNCIÓN PARA LIMPIAR SELECCIÓN DE SERVICIO
  const limpiarServicio = () => {
    setServicioSeleccionado(null);
    setServicio("");
    setBusquedaServicio("");
    setMostrarDropdownServicios(false);
  };

  // ✅ NUEVA FUNCIÓN PARA LIMPIAR SELECCIÓN DE USUARIO
  const limpiarUsuario = () => {
    setUsuarioSeleccionado(null);
    setUsuario("");
    setBusquedaUsuario("");
    setMostrarDropdownUsuarios(false);
  };

  // Funciones para recargar datos después de crear entidades
  const handleClienteCreado = async () => {
    await onTurnoCreado();
    setShowNuevoClienteModal(false);
  };

  const handleServicioCreado = async () => {
    await onTurnoCreado();
    setShowNuevoServicioModal(false);
  };

  const handleUsuarioCreado = async () => {
    await onTurnoCreado();
    setShowNuevoUsuarioModal(false);
  };

  const resetForm = () => {
    setClienteId(null);
    setServicio("");
    setUsuario("");
    setFecha("");
    setHora("");
    setNotas("");
    setShowTimeSelector(false);

    // ✅ LIMPIAR BÚSQUEDAS (ACTUALIZADO)
    setBusquedaCliente("");
    setClienteSeleccionado(null);
    setMostrarDropdownClientes(false);

    setBusquedaServicio("");
    setServicioSeleccionado(null);
    setMostrarDropdownServicios(false);

    setBusquedaUsuario("");
    setUsuarioSeleccionado(null);
    setMostrarDropdownUsuarios(false);

    setErrores({});
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ show: false, message: "" });
    resetForm();
    onClose();
  };

  if (!show) return null;

  const handleGuardar = async () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (!clienteId) nuevosErrores.cliente = "El cliente es obligatorio";
    if (!servicio) nuevosErrores.servicio = "El servicio es obligatorio";
    if (!usuario) nuevosErrores.usuario = "El profesional es obligatorio";
    if (!fecha) nuevosErrores.fecha = "La fecha es obligatoria";
    if (!hora) nuevosErrores.hora = "La hora es obligatoria";
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const turno = {
      clienteId: clienteId,
      servicioId: Number(servicio),
      usuarioId: Number(usuario),
      fecha,
      hora,
      notas,
    };

    try {
      const response = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno),
      });

      if (response.ok) {
        await onTurnoCreado();
        setSuccessModal({
          show: true,
          message: "Turno creado correctamente",
        });
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
          <FaArrowLeft
            className="back-arrow"
            onClick={() => {
              onClose();
              resetForm();
            }}
          />
          <div>
            <h2 className="modal-title3">Nuevo Turno</h2>
            <p className="modal-subtitle">
              Agenda un nuevo turno para un cliente
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="form-container">
          <div className="form-row">
            {/* ✅ BÚSQUEDA DE CLIENTE (YA EXISTENTE) */}
            <div className="form-group">
              <label>Cliente</label>
              <div className="cliente-search-wrapper" ref={clienteSearchRef}>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre, DNI, teléfono..."
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    onFocus={() =>
                      busquedaCliente &&
                      setMostrarDropdownClientes(clientesFiltrados.length > 0)
                    }
                    className="cliente-search-input"
                  />
                  {clienteSeleccionado && (
                    <button
                      type="button"
                      className="clear-cliente-btn"
                      onClick={limpiarCliente}
                      title="Limpiar selección"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="button"
                    className="add-button-inline"
                    onClick={() => setShowNuevoClienteModal(true)}
                    title="Agregar nuevo cliente"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Dropdown de resultados */}
                {mostrarDropdownClientes && clientesFiltrados.length > 0 && (
                  <div className="clientes-dropdown">
                    {clientesFiltrados.map((cliente) => (
                      <div
                        key={cliente.id}
                        className="cliente-option"
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <div className="cliente-info-simple">
                          <div className="cliente-detalles">
                            <span className="cliente-nombre">
                              {cliente.nombre} {cliente.apellido}
                            </span>
                            <span className="cliente-meta">
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

                {/* Cliente seleccionado SIN ICONO */}
                {clienteSeleccionado && (
                  <div className="cliente-seleccionado-simple">
                    <div className="cliente-detalles">
                      <span className="cliente-nombre">
                        ✓ {clienteSeleccionado.nombre}{" "}
                        {clienteSeleccionado.apellido}
                      </span>
                      <span className="cliente-meta">
                        {clienteSeleccionado.dni &&
                          `DNI: ${clienteSeleccionado.dni}`}
                        {clienteSeleccionado.dni &&
                          clienteSeleccionado.telefono &&
                          " | "}
                        {clienteSeleccionado.telefono &&
                          `Tel: ${clienteSeleccionado.telefono}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {errores.cliente && <p className="error">{errores.cliente}</p>}
            </div>

            {/* ✅ NUEVA BÚSQUEDA DE SERVICIO */}
            <div className="form-group">
              <label>Servicio</label>
              <div className="servicio-search-wrapper" ref={servicioSearchRef}>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Buscar servicio..."
                    value={busquedaServicio}
                    onChange={(e) => setBusquedaServicio(e.target.value)}
                    onFocus={() =>
                      busquedaServicio &&
                      setMostrarDropdownServicios(serviciosFiltrados.length > 0)
                    }
                    className="servicio-search-input"
                  />
                  {servicioSeleccionado && (
                    <button
                      type="button"
                      className="clear-servicio-btn"
                      onClick={limpiarServicio}
                      title="Limpiar selección"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="button"
                    className="add-button-inline"
                    onClick={() => setShowNuevoServicioModal(true)}
                    title="Agregar nuevo servicio"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Dropdown de servicios */}
                {mostrarDropdownServicios && serviciosFiltrados.length > 0 && (
                  <div className="servicios-dropdown">
                    {serviciosFiltrados.map((servicio) => (
                      <div
                        key={servicio.id}
                        className="servicio-option"
                        onClick={() => seleccionarServicio(servicio)}
                      >
                        <div className="servicio-info-simple">
                          <div className="servicio-detalles">
                            <span className="servicio-nombre">
                              {servicio.servicio}
                            </span>
                            <span className="servicio-meta">
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

                {/* Servicio seleccionado SIN ICONO */}
                {servicioSeleccionado && (
                  <div className="servicio-seleccionado-simple">
                    <div className="servicio-detalles">
                      <span className="servicio-nombre">
                        ✓ {servicioSeleccionado.servicio}
                      </span>
                      <span className="servicio-meta">
                        {servicioSeleccionado.precio &&
                          `$${servicioSeleccionado.precio}`}
                        {servicioSeleccionado.precio &&
                          servicioSeleccionado.duracion &&
                          " | "}
                        {servicioSeleccionado.duracion &&
                          `${servicioSeleccionado.duracion} min`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {errores.servicio && <p className="error">{errores.servicio}</p>}
            </div>

            {/* ✅ NUEVA BÚSQUEDA DE PROFESIONAL */}
            <div className="form-group">
              <label>Profesional asignado</label>
              <div className="usuario-search-wrapper" ref={usuarioSearchRef}>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Buscar profesional..."
                    value={busquedaUsuario}
                    onChange={(e) => setBusquedaUsuario(e.target.value)}
                    onFocus={() =>
                      busquedaUsuario &&
                      setMostrarDropdownUsuarios(usuariosFiltrados.length > 0)
                    }
                    className="usuario-search-input"
                  />
                  {usuarioSeleccionado && (
                    <button
                      type="button"
                      className="clear-usuario-btn"
                      onClick={limpiarUsuario}
                      title="Limpiar selección"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="button"
                    className="add-button-inline"
                    onClick={() => setShowNuevoUsuarioModal(true)}
                    title="Agregar nuevo profesional"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Dropdown de usuarios */}
                {mostrarDropdownUsuarios && usuariosFiltrados.length > 0 && (
                  <div className="usuarios-dropdown">
                    {usuariosFiltrados.map((usuario) => (
                      <div
                        key={usuario.id}
                        className="usuario-option"
                        onClick={() => seleccionarUsuario(usuario)}
                      >
                        <div className="usuario-info-simple">
                          <div className="usuario-detalles">
                            <span className="usuario-nombre">
                              {usuario.nombre} {usuario.apellido}
                            </span>
                            <span className="usuario-meta">
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

                {/* Usuario seleccionado SIN ICONO */}
                {usuarioSeleccionado && (
                  <div className="usuario-seleccionado-simple">
                    <div className="usuario-detalles">
                      <span className="usuario-nombre">
                        ✓ {usuarioSeleccionado.nombre}{" "}
                        {usuarioSeleccionado.apellido}
                      </span>
                      <span className="usuario-meta">
                        {usuarioSeleccionado.rol === "admin"
                          ? "Administrador"
                          : "Empleado"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {errores.usuario && <p className="error">{errores.usuario}</p>}
            </div>
          </div>

          {/* Resto del formulario permanece igual */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              {errores.fecha && <p className="error">{errores.fecha}</p>}
            </div>
            <div className="form-group">
              <label>Hora</label>
              <div className="custom-time-selector" ref={timeSelectorRef}>
                <div
                  className="time-input-display"
                  onClick={() => setShowTimeSelector(!showTimeSelector)}
                >
                  <span>{hora || "Seleccionar hora"}</span>
                  <FaClock />
                </div>
                {showTimeSelector && (
                  <div className="time-picker-dropdown">
                    <div className="time-columns">
                      <div className="time-column">
                        <h4>Hora</h4>
                        <div className="time-list">
                          {Array.from({ length: 24 }, (_, i) => (
                            <div
                              key={i}
                              className="time-option"
                              onClick={() => {
                                const minutes = hora.split(":")[1] || "00";
                                const newTime = `${i
                                  .toString()
                                  .padStart(2, "0")}:${minutes}`;
                                setHora(newTime);
                              }}
                            >
                              {i.toString().padStart(2, "0")}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="time-column">
                        <h4>Minutos</h4>
                        <div className="time-list">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={i}
                              className="time-option"
                              onClick={() => {
                                const hours = hora.split(":")[0] || "00";
                                const minutes = (i * 5)
                                  .toString()
                                  .padStart(2, "0");
                                const newTime = `${hours}:${minutes}`;
                                setHora(newTime);
                              }}
                            >
                              {(i * 5).toString().padStart(2, "0")}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="time-actions">
                      <button
                        type="button"
                        className="time-close-btn"
                        onClick={() => setShowTimeSelector(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errores.hora && <p className="error">{errores.hora}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Notas adicionales</label>
            <textarea
              rows={2}
              placeholder="Agregar notas o preferencias del cliente..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancelar
            </button>
            <button className="save-btn" onClick={handleGuardar}>
              Guardar Turno
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        show={successModal.show}
        message={successModal.message}
        onClose={handleSuccessModalClose}
      />

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
    </div>
  );
}
