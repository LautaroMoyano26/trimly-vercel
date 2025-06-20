import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Tabla from "../components/Tabla";
// Importamos el modal de edición que ya modificamos
import EditarClienteModal from "./EditarClienteModal"; // Asegúrate de que el nombre del archivo sea correcto
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
  fechaNacimiento: string;
  activo: boolean;
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

  // Nuevo estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Buscar...");

  // Cargar clientes desde el backend
  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/clientes");
      if (!res.ok) throw new Error("No se pudo obtener clientes");
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setClientes([]);
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para abrir el modal en modo edición
  const handleEditClick = (cliente: Cliente) => {
    setSelectedClient(cliente); // Establece el cliente que se va a editar
    setShowEditModal(true); // Abre el modal
  };

  // Función para abrir el modal en modo creación
  const handleNewClientClick = () => {
    setSelectedClient(undefined); // Asegura que no haya cliente seleccionado para "Crear"
    setShowEditModal(true); // Abre el modal
  };

  // Filtrar clientes por nombre o apellido
  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepara los datos para la tabla
  const data = filteredClientes.map((c) => ({
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
      <span className="estado-badge">{c.activo ? "Activo" : "Inactivo"}</span>
    ),
    acciones: (
      <>
        {/* Agregamos onClick al botón de editar y le pasamos el cliente actual */}
        <button
          className="btn-accion editar"
          title="Editar"
          onClick={() => handleEditClick(c)}
        >
          <FaEdit />
        </button>
        <button className="btn-accion eliminar" title="Eliminar">
          <FaTrash />
        </button>
      </>
    ),
  }));

  return (
    <div className="clientes-container container-fluid py-4 px-2 px-md-4">
      {/* Usamos el mismo modal para crear y editar */}
      <EditarClienteModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClient(undefined); // Limpiamos el cliente seleccionado al cerrar
        }}
        onClienteEditado={fetchClientes} // Llama a fetchClientes para recargar la lista
        clienteToEdit={selectedClient} // Pasamos el cliente seleccionado al modal
      />
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Clientes</h1>
          <p className="text-secondary mb-0">
            Gestiona los clientes de tu peluquería
          </p>
        </div>
        <div className="col-auto">
          {/* Cambiamos el onClick del botón "Nuevo cliente" */}
          <button className="nuevo-cliente-btn" onClick={handleNewClientClick}>
            + Nuevo cliente
          </button>
        </div>
      </div>
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
      <Tabla columns={columns} data={data} />
    </div>
  );
}
