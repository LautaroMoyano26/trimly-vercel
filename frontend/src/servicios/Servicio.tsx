import React, { useState, useEffect } from "react";
import "./Servicio.css";
import Tabla from "../components/Tabla";
import NuevoServicioModal from "./NuevoServicioModal";
import EditarServicioModal from "./EditarServicioModal";
import { FaClock, FaEdit, FaTrash, FaCut, FaSearch } from "react-icons/fa";

interface Servicio {
  id: number;
  servicio: string;
  descripcion: string;
  duracion: string;
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
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<Servicio | null>(null);
  const [filtro, setFiltro] = useState("");

  // Cargar servicios desde el backend (filtrado por nombre si hay filtro)
  const cargarServicios = async (nombreFiltro = "") => {
    try {
      let url = "http://localhost:3000/servicios";
      if (nombreFiltro.trim() !== "") {
        url = `http://localhost:3000/servicios/buscar/nombre?nombre=${encodeURIComponent(nombreFiltro)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      alert("No se pudieron cargar los servicios.");
    }
  };

  // Cargar todos los servicios al montar
  useEffect(() => {
    cargarServicios();
  }, []);

  // Buscar servicios cada vez que cambia el filtro
  useEffect(() => {
    cargarServicios(filtro);
  }, [filtro]);

  const handleServicioCreado = () => {
    setShowModal(false);
    cargarServicios(filtro);
  };

  const handleServicioEditado = () => {
    setShowEditarModal(false);
    setServicioEditar(null);
    cargarServicios(filtro);
  };

  
  const data = servicios.map((s) => ({
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
          onClick={() => {
            setServicioEditar(s);
            setShowEditarModal(true);
          }}
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


    <div className="mb-3">
      <div className="input-modal">
        <input
        className="input-modal"
        type="text"
        placeholder="Buscar servicio por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      </div>
    </div>

      <Tabla columns={columns} data={data} />

      <NuevoServicioModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onServicioCreado={handleServicioCreado}
      />

      <EditarServicioModal
        show={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        servicioEditar={servicioEditar}
        onServicioEditado={handleServicioEditado}
      />
    </div>
  );
}