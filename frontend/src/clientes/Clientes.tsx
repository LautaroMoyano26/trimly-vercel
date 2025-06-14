import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Tabla from "../components/Tabla";
import NuevoClienteModal from "./NuevoClienteModal";
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

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
  { key: "visitas", label: "Visitas" }, // Puedes quitar si no usas visitas aún
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Cargar clientes desde el backend
  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/clientes");
      if (!res.ok) throw new Error("No se pudo obtener clientes");
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setClientes([]);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Prepara los datos para la tabla
  const data = clientes.map((c) => ({
    cliente: (
      <span className="d-flex align-items-center gap-2">
        <FaUserCircle size={32} color="#a259ff" />
        <span className="fw-bold">{c.nombre} {c.apellido}</span>
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
    ) : "-",
    visitas: <span className="visitas-badge">-</span>, // Puedes reemplazar por el dato real si lo tienes
    estado: (
      <span className="estado-badge">
        {c.activo ? "Activo" : "Inactivo"}
      </span>
    ),
    acciones: null,
  }));

  return (
    <div className="clientes-container container-fluid py-4 px-2 px-md-4">
      <NuevoClienteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onClienteCreado={fetchClientes}
      />
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Clientes</h1>
          <p className="text-secondary mb-0">Gestiona los clientes de tu peluquería</p>
        </div>
        <div className="col-auto">
          <button className="nuevo-cliente-btn" onClick={() => setShowModal(true)}>
            + Nuevo cliente
          </button>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <input
            className="form-control clientes-busqueda"
            placeholder="Buscar cliente por nombre, teléfono o email..."
            // Puedes agregar lógica de búsqueda aquí
          />
        </div>
      </div>
      <Tabla columns={columns} data={data} />
    </div>
  );
}