import "./Clientes.css";
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

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
  // ...agrega más clientes según tu ejemplo
];

export default function Clientes() {
  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <p>Gestiona los clientes de tu peluquería</p>
        <button className="nuevo-cliente-btn">+ Nuevo cliente</button>
      </div>
      <input
        className="clientes-busqueda"
        placeholder="Buscar cliente por nombre, teléfono o email..."
      />
      <div className="clientes-table">
        <div className="clientes-table-header">
          <span>Cliente</span>
          <span>Contacto</span>
          <span>DNI</span>
          <span>Última visita</span>
          <span>Visitas</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {clientes.map((c, i) => (
          <div className="clientes-table-row" key={i}>
            <span className="cliente-avatar">
              <FaUserCircle size={32} color="#a259ff" />
              <span className="cliente-nombre">{c.nombre}</span>
            </span>
            <span>
              <FaPhoneAlt size={12} style={{ marginRight: 6 }} />
              {c.telefono}
              <br />
              <FaEnvelope size={12} style={{ marginRight: 6 }} />
              {c.email}
            </span>
            <span>{c.dni}</span>
            <span>
              <FaCalendarAlt size={14} style={{ marginRight: 6 }} />
              {c.ultimaVisita}
            </span>
            <span>
              <span className="visitas-badge">{c.visitas} visitas</span>
            </span>
            <span>
              <span className="estado-badge">{c.estado}</span>
            </span>
            <span>
              {/* Aquí irán los botones de acciones (editar, borrar, etc.) */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}