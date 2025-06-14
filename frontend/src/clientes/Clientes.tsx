import "./Clientes.css";
import Tabla from "../components/Tabla";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const clientes = [
  {
    nombre: "María García",
    telefono: "11-2345-6789",
    email: "maria@gmail.com",
    dni: "12345678",
    ultimaVisita: "15/04/2025",
    visitas: 8,
    estado: "Activo",
  },
  {
    nombre: "Juan Pérez",
    telefono: "11-8765-4321",
    email: "juan@gmail.com",
    dni: "87654321",
    ultimaVisita: "20/04/2025",
    visitas: 5,
    estado: "Activo",
  },
  // ...más clientes
];

// Define las columnas
const columns = [
  { key: "cliente", label: "Cliente" },
  { key: "contacto", label: "Contacto" },
  { key: "dni", label: "DNI" },
  { key: "ultimaVisita", label: "Última visita" },
  { key: "visitas", label: "Visitas" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

// Prepara los datos para la tabla
const data = clientes.map((c) => ({
  cliente: (
    <span className="d-flex align-items-center gap-2">
      <FaUserCircle size={32} color="#a259ff" />
      <span className="fw-bold">{c.nombre}</span>
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
  ultimaVisita: (
    <>
      <FaCalendarAlt size={14} className="me-1" />
      {c.ultimaVisita}
    </>
  ),
  visitas: <span className="visitas-badge">{c.visitas} visitas</span>,
  estado: <span className="estado-badge">{c.estado}</span>,
  acciones: (
    <>
      <button className="btn-accion editar" title="Editar">
        <FaEdit />
      </button>
      <button className="btn-accion eliminar" title="Eliminar">
        <FaTrash />
      </button>
    </>
  ),
}));

export default function Clientes() {
  return (
    <div className="clientes-container container-fluid py-4 px-2 px-md-4">
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Clientes</h1>
          <p className="text-secondary mb-0">
            Gestiona los clientes de tu peluquería
          </p>
        </div>
        <div className="col-auto">
          <button className="nuevo-cliente-btn">+ Nuevo cliente</button>
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
