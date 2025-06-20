// src/components/Clientes.tsx
import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Tabla from "../components/Tabla";
import EditarClienteModal from "./EditarClienteModal";
import EliminarClienteModal from "../components/EliminarClienteModal"; // <-- ¡NUEVA IMPORTACIÓN!
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

  // --- NUEVOS ESTADOS PARA LA MODAL DE ELIMINAR ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Cliente | undefined>(undefined);

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
      alert("No se pudieron cargar los clientes. Revisa la conexión al servidor.");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para abrir el modal en modo edición
  const handleEditClick = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setShowEditModal(true);
  };

  // Función para abrir el modal en modo creación
  const handleNewClientClick = () => {
    setSelectedClient(undefined);
    setShowEditModal(true);
  };

  // --- NUEVA FUNCIÓN PARA ABRIR LA MODAL DE ELIMINAR ---
  const handleDeleteClick = (cliente: Cliente) => {
    setClientToDelete(cliente); // Establece el cliente a desactivar
    setShowDeleteModal(true); // Abre la modal de desactivación
  };

  // Prepara los datos para la tabla
  const data = clientes.map((c) => ({
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
      <span className={`estado-badge ${c.activo ? 'activo' : 'inactivo'}`}>
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
        {/* --- CAMBIO AQUÍ: LLAMAR A LA FUNCIÓN PARA ABRIR LA MODAL DE ELIMINAR --- */}
        <button
          className="btn-accion eliminar"
          title="Desactivar"
          onClick={() => handleDeleteClick(c)} // Pasa el cliente completo
        >
          <FaTrash />
        </button>
      </>
    ),
  }));

  return (
    <div className="clientes-container container-fluid py-4 px-2 px-md-4">
      <EditarClienteModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClient(undefined);
        }}
        onClienteEditado={fetchClientes}
        clienteToEdit={selectedClient}
      />

      {/* --- NUEVA MODAL DE ELIMINAR/DESACTIVAR --- */}
      <EliminarClienteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClientToDelete(undefined); // Limpiamos el cliente al cerrar
        }}
        clienteToDeactivate={clientToDelete}
        onClienteDesactivado={fetchClientes} // Le pasamos la misma función de recarga
      />

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
      <div className="row mb-3">
        <div className="col">
          <input
            className="form-control clientes-busqueda"
            placeholder="Buscar cliente por nombre, teléfono o email..."
          />
        </div>
      </div>
      <Tabla columns={columns} data={data} />
    </div>
  );
}