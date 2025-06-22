// frontend/src/servicios/Servicio.tsx - ACTUALIZAR CON MODAL DE ELIMINACIÓN
import { useState, useEffect } from "react";
import "./Servicio.css";
import Tabla from "../components/Tabla";
import NuevoServicioModal from "./NuevoServicioModal";
import EditarServicioModal from "./EditarServicioModal";
import EliminarServicioModal from "./EliminarServicioModal"; // ✅ NUEVA IMPORTACIÓN
import { FaClock, FaEdit, FaTrash, FaCut } from "react-icons/fa";

interface Servicio {
  id: number;
  servicio: string;
  descripcion: string;
  duracion: number;
  precio: number;
  estado: boolean;
}

const columns = [
  { key: "servicio", label: "Servicio" },
  { key: "descripcion", label: "Descripción" },
  { key: "duracion", label: "Duración" },
  { key: "precio", label: "Precio" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

export default function Servicios() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ NUEVO ESTADO
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioEditar, setServicioEditar] = useState<Servicio | null>(null);
  const [servicioEliminar, setServicioEliminar] = useState<Servicio | undefined>(undefined); // ✅ NUEVO ESTADO
  const [busqueda, setBusqueda] = useState(""); // Estado para el buscador

  // Cargar servicios desde el backend
  const cargarServicios = async () => {
    try {
      const res = await fetch("http://localhost:3000/servicios");
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      alert("No se pudieron cargar los servicios.");
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleServicioCreado = () => {
    setShowModal(false);
    cargarServicios();
  };

  const handleServicioEditado = () => {
    setShowEditModal(false);
    setServicioEditar(null);
    cargarServicios();
  };

  // ✅ NUEVA FUNCIÓN PARA MANEJAR ELIMINACIÓN
  const handleServicioEliminado = async () => {
    setShowDeleteModal(false);
    setServicioEliminar(undefined);
    await cargarServicios();
  };

  // ✅ FUNCIÓN PARA ABRIR MODAL DE ELIMINACIÓN
  const handleDeleteClick = (servicio: Servicio) => {
    setServicioEliminar(servicio);
    setShowDeleteModal(true);
  };

  // Función para abrir modal de edición
  const handleEditClick = (servicio: Servicio) => {
    setServicioEditar(servicio);
    setShowEditModal(true);
  };

  // Filtrar servicios según búsqueda
  const serviciosFiltrados = servicios.filter(
    (s) =>
      s.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Prepara los datos para la tabla
  const data = serviciosFiltrados.map((s) => ({
    servicio: (
      <span className="fw-bold d-flex align-items-center gap-2">
        <FaCut className="icono-tijera" />
        <span>{s.servicio}</span>
      </span>
    ),
    descripcion: s.descripcion,
    duracion: (
      <>
        <FaClock size={14} className="me-1" />
        {s.duracion}
      </>
    ),
    precio: <>${s.precio}</>,
    estado: (
      <span className="estado-badge">
        {s.estado ? "Activo" : "Inactivo"}
      </span>
    ),
    acciones: (
      <>
        <button 
          className="btn-accion editar" 
          title="Editar"
          onClick={() => handleEditClick(s)}
        >
          <FaEdit />
        </button>
        <button 
          className="btn-accion eliminar" 
          title="Eliminar"
          onClick={() => handleDeleteClick(s)} // ✅ NUEVA FUNCIÓN
        >
          <FaTrash />
        </button>
      </>
    ),
  }));

  return (
    <div className="servicio-container container-fluid py-4 px-2 px-md-4">
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Servicios</h1>
          <p className="text-secondary mb-0">Gestiona los Servicios de tu peluquería</p>
        </div>
        <div className="col-auto">
          <button className="nuevo-servicio-btn" onClick={() => setShowModal(true)}>
            + Nuevo Servicio
          </button>
        </div>
      </div>

     
      <div className="row mb-3">
        <div className="col">
          <input
            className="form-control clientes-busqueda"
            type="text"
            placeholder="Buscar servicio por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <Tabla columns={columns} data={data} />

      {/* Modal de Nuevo Servicio */}
      <NuevoServicioModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onServicioCreado={handleServicioCreado}
      />

      {/* Modal de Editar Servicio */}
      <EditarServicioModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setServicioEditar(null);
        }}
        servicioEditar={servicioEditar}
        onServicioEditado={handleServicioEditado}
      />

      {/* ✅ NUEVA MODAL DE ELIMINAR SERVICIO */}
      <EliminarServicioModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setServicioEliminar(undefined);
        }}
        servicioToDelete={servicioEliminar}
        onServicioEliminado={handleServicioEliminado}
      />
    </div>
  );
}