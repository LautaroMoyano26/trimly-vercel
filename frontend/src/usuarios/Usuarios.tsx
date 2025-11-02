import { useEffect, useState } from "react";
import "./Usuarios.css";
import TablaResponsive from "../components/TablaResponsive";
import type { ColumnaTabla } from "../components/TablaResponsive";
import NuevoUsuarioModal from "./NuevoUsuarioModal";
import EditarUsuarioModal from "./EditarUsuarioModal"; // Importar
import EliminarUsuarioModal from "./EliminarUsuarioModal"; // Importar
import { API_URL } from '../config/api';
import {
  FaUserCircle,
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "admin" | "empleado";
  activo: boolean;
  fechaCreacion: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false); // Estado para modal de edici�n
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false); // Estado para modal de eliminaci�n
  const [selectedUser, setSelectedUser] = useState<Usuario | undefined>(
    undefined
  ); // Usuario para editar/eliminar
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Buscar por nombre, usuario, email..."
  );

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      if (!res.ok) throw new Error("No se pudo obtener usuarios");
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setUsuarios([]);
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setShowEditUserModal(true);
  };

  const handleNewUserClick = () => {
    setShowNewUserModal(true);
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setShowDeleteUserModal(true);
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      (u.nombre || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      (u.apellido || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      (u.username || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const sortedAndFilteredUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a.activo && !b.activo) return -1;
    if (!a.activo && b.activo) return 1;
    return a.username.localeCompare(b.username);
  });

  // Definir columnas de la tabla
  const columns: ColumnaTabla[] = [
    {
      key: "nombre",
      label: "Usuario",
      icon: <FaUserCircle className="text-secondary" />,
      render: (_, row) => (
        <>
          <div className="fw-bold">{row.nombre} {row.apellido}</div>
          <small className="text-secondary">@{row.username}</small>
        </>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <>
          <FaEnvelope className="text-secondary email-icon me-1" />
          {value}
        </>
      ),
    },
    {
      key: "rol",
      label: "Rol",
      render: (value) => (
        <>
          <FaUserShield className="text-secondary rol-icon me-1" />
          {value === "admin" ? "Administrador" : "Empleado"}
        </>
      ),
    },
    {
      key: "fechaCreacion",
      label: "Miembro desde",
      render: (value) =>
        value ? (
          <>
            <FaCalendarAlt className="text-secondary me-1" />
            {new Date(value).toLocaleDateString()}
          </>
        ) : (
          "-"
        ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (value) => (
        <span
          className={value ? "estado-badge-activo" : "estado-badge-inactivo"}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <>
          <button
            className="btn-accion editar"
            title="Editar usuario"
            onClick={() => handleEditClick(row)}
          >
            <FaEdit />
          </button>
          <button
            className="btn-accion eliminar"
            title="Desactivar usuario"
            onClick={() => handleDeleteClick(row)}
            disabled={!row.activo}
          >
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="usuarios-container container-fluid py-4 px-2 px-md-4">
      <NuevoUsuarioModal
        show={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onUsuarioCreado={fetchUsuarios}
      />

      <EditarUsuarioModal
        show={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(undefined);
        }}
        usuarioToEdit={selectedUser}
        onUsuarioEditado={fetchUsuarios}
      />

      <EliminarUsuarioModal
        show={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false);
          setSelectedUser(undefined);
        }}
        usuarioToDeactivate={selectedUser}
        onUsuarioDesactivado={fetchUsuarios}
      />

      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fw-bold mb-0">Usuarios</h1>
          <p className="text-secondary mb-0">
            Gestiona los usuarios de tu sistema
          </p>
        </div>
        <div className="col-auto">
          <button className="nuevo-usuario-btn" onClick={handleNewUserClick}>
            <FaPlus /> Nuevo usuario
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            className="form-control usuarios-busqueda"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchPlaceholder("")}
            onBlur={() =>
              !searchTerm &&
              setSearchPlaceholder("Buscar por nombre, usuario, email...")
            }
          />
        </div>
      </div>

      <TablaResponsive
        columns={columns}
        data={sortedAndFilteredUsuarios}
        keyExtractor={(usuario) => usuario.id}
        className="usuarios-tabla-container"
      />
    </div>
  );
}
