import "./Servicio.css";
import Tabla from "../components/Tabla";
import { FaClock, FaEdit, FaTrash, FaCut } from "react-icons/fa";

const servicios = [
  {
    nombre: "Corte de Cabello",
    descripcion: "Corte profesional adaptado a tu estilo",
    duracion: 30,
    precio: 2500,
    estado: "Activo",
  },
  {
    nombre: "Tintura completa",
    descripcion: "Coloración completa con productos premium",
    duracion: 120,
    precio: 8000,
    estado: "Activo",
  },
  {
    nombre: "Peinado",
    descripcion: "Peinado para eventos especiales",
    duracion: 45,
    precio: 3000,
    estado: "Activo",
  },
  {
    nombre: "Barba y bigote",
    descripcion: "Arreglo y diseño de barba profesional",
    duracion: 20,
    precio: 1500,
    estado: "Activo",
  },
  {
    nombre: "Mechas",
    descripcion: "Mechas con técnica balayage",
    duracion: 90,
    precio: 7000,
    estado: "Activo",
  },
];

// Define las columnas para servicios
const columns = [
  { key: "servicio", label: "Servicio" },
  { key: "descripcion", label: "Descripción" },
  { key: "duracion", label: "Duración" },
  { key: "precio", label: "Precio" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

// Prepara los datos para la tabla
const data = servicios.map((s) => ({
  servicio: (
    <span className="fw-bold d-flex align-items-center gap-2">
      <FaCut className="icono-tijera" />
      <span>{s.nombre}</span>
    </span>
  ),
  descripcion: s.descripcion,
  duracion: (
    <>
      <FaClock size={14} className="me-1" />
      {s.duracion} min
    </>
  ),
  precio: (
    <>
      ${s.precio}
    </>
  ),
  estado: <span className="estado-badge">{s.estado}</span>,
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

export default function Servicios() {
  return (
    <div className="servicio-container container-fluid py-4 px-2 px-md-4">
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Servicios</h1>
          <p className="text-secondary mb-0">Gestiona los Servicios de tu peluquería</p>
        </div>
        <div className="col-auto">
          <button className="nuevo-servicio-btn">+ Nuevo Servicio</button>
        </div>
      </div>

      <Tabla columns={columns} data={data} />
    </div>
  );
}
