import { useEffect, useState } from "react";
import "./Clientes.css"; // Asegúrate de que este archivo CSS existe y lo tienes actualizado
import Tabla from "../components/Tabla";
import EditarClienteModal from "./EditarClienteModal";
import EliminarClienteModal from "../components/EliminarClienteModal";
import NuevoClienteModal from "./NuevoClienteModal";
import SuccessModal from "../components/SuccessModal";
import HistorialClienteModal from "./HistorialClienteModal";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
  fechaNacimiento: string;
  activo: boolean; // Esta propiedad es CLAVE para el estado y el ordenamiento
}

const columns = [
  { key: "cliente", label: "Cliente" },
  { key: "contacto", label: "Contacto" },
  { key: "dni", label: "DNI" },
  { key: "fechaNacimiento", label: "Fecha de nacimiento" },
  { key: "visitas", label: "Visitas" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | undefined>(
    undefined
  );
  const [showNewModal, setShowNewModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [clienteHistorial, setClienteHistorial] = useState<Cliente | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Buscar...");

  // Función para cargar clientes desde el backend
  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/clientes");
      if (!res.ok) throw new Error("No se pudo obtener clientes");
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setClientes([]); // Asegura que la lista quede vacía si hay un error
      console.error("Error al cargar clientes:", error);
    }
  };

  // Cargar los clientes al iniciar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Manejadores para abrir los modales
  const handleEditClick = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setShowEditModal(true);
  };

  const handleNewClientClick = () => {
    setShowNewModal(true);
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const abrirHistorial = (cliente: Cliente) => {
    setClienteHistorial(cliente);
    setMostrarHistorial(true);
  };

  // Callbacks para mostrar el modal de éxito
  const handleClienteCreado = async () => {
    await fetchClientes();
    setSuccessModal({
      show: true,
      message: "Cliente registrado correctamente",
    });
    setShowNewModal(false);
  };

  const handleClienteEditado = async () => {
    await fetchClientes();
    setSuccessModal({ show: true, message: "Cliente editado correctamente" });
    setShowEditModal(false);
    setSelectedClient(undefined);
  };

  const handleClienteDesactivado = async () => {
    await fetchClientes();
    setSuccessModal({
      show: true,
      message: "Cliente desactivado correctamente",
    });
    setShowDeleteModal(false);
    setClienteToDelete(undefined);
  };

  // --- FILTRADO Y ORDENAMIENTO DE CLIENTES ---

  // 1. Filtrar clientes por término de búsqueda (nombre/apellido)
  const filteredClientes = clientes.filter(
    (c) =>
      (c.nombre || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      (c.apellido || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // 2. Ordenar clientes: Activos primero, Inactivos al final.
  // Si tienen el mismo estado (ambos activos o ambos inactivos), se ordenan por nombre.
  const sortedAndFilteredClientes = [...filteredClientes].sort((a, b) => {
    // Si 'a' está activo y 'b' inactivo, 'a' va antes (-1)
    if (a.activo && !b.activo) {
      return -1;
    }
    // Si 'a' está inactivo y 'b' activo, 'a' va después (1)
    if (!a.activo && b.activo) {
      return 1;
    }
    // Si ambos tienen el mismo estado, ordenar alfabéticamente por nombre
    return a.nombre.localeCompare(b.nombre);
  });

  // --- PREPARACIÓN DE DATOS PARA LA TABLA ---

  const data = sortedAndFilteredClientes.map((c) => ({
    cliente: (
      <span className="d-flex align-items-center gap-2">
        <FaUserCircle size={32} color="#a259ff" />
        <span className="fw-bold">
          {c.nombre} {c.apellido}
        </span>
      </span>
    ),
    contacto: (
      <>
        <FaPhoneAlt size={12} className="me-1" />
        {c.telefono}
        <br />
        <FaEnvelope size={12} className="me-1" />
        {c.email}
      </>
    ),
    dni: c.dni,
    fechaNacimiento: c.fechaNacimiento ? (
      <>
        <FaCalendarAlt size={14} className="me-1" />
        {c.fechaNacimiento}
      </>
    ) : (
      "-"
    ),
    visitas: <span className="visitas-badge">-</span>,
    estado: (
      <span
        className={c.activo ? "estado-badge-activo" : "estado-badge-inactivo"}
      >
        {c.activo ? "Activo" : "Inactivo"}
      </span>
    ),
    acciones: (
      <>
        <button
          className="btn-accion editar"
          title="Editar"
          onClick={() => handleEditClick(c)}
        >
          <FaEdit />
        </button>
        <button
          className="btn-accion eliminar"
          title="Desactivar"
          onClick={() => handleDeleteClick(c)}
          disabled={!c.activo}
        >
          <FaTrash />
        </button>
        <button
          className="btn-accion historial"
          onClick={() => abrirHistorial(c)}
          title="Ver historial"
        >
          <FaClipboardList />
        </button>
      </>
    ),
  }));

  // Renderizado del componente
  return (
    <div className="clientes-container">
      {/* Modales */}
      <NuevoClienteModal
        show={showNewModal}
        onClose={() => setShowNewModal(false)}
        onClienteCreado={handleClienteCreado}
      />
      <EditarClienteModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClient(undefined);
        }}
        onClienteEditado={handleClienteEditado}
        clienteToEdit={selectedClient}
      />
      <EliminarClienteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClienteToDelete(undefined);
        }}
        clienteToDeactivate={clienteToDelete}
        onClienteDesactivado={handleClienteDesactivado}
      />
      <SuccessModal
        show={successModal.show}
        message={successModal.message}
        onClose={() => setSuccessModal({ show: false, message: "" })}
      />
      <HistorialClienteModal
        show={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
        cliente={clienteHistorial}
      />

      {/* Encabezado */}
      <div className="clientes-header">
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="fw-bold mb-0">Clientes</h1>
            <p className="text-secondary mb-0">
              Gestiona los clientes de tu peluquería
            </p>
          </div>
          <div className="col-auto">
            <button className="nuevo-cliente-btn" onClick={handleNewClientClick}>
              + Nuevo cliente
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="clientes-busqueda-container">
        <div className="row mb-3">
          <div className="col">
            <input
              className="form-control clientes-busqueda"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchPlaceholder("")}
              onBlur={() => !searchTerm && setSearchPlaceholder("Buscar...")}
            />
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="clientes-tabla-container">
        <Tabla columns={columns} data={data} />
      </div>
    </div>
  );
}
