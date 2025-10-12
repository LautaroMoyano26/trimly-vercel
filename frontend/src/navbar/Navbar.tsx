import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCut,
  FaCalendarAlt,
  FaUserFriends,
  FaBoxOpen,
  FaClipboardList,
  FaUserCog,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";
import "./Navbar.css";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  section: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  
  // Usar try-catch para manejar errores del hook
  let user = null;
  let canAccess = (_section: string) => true;
  let logout = () => {};
  let isAdmin = true;
  let isEmpleado = false;
  
  try {
    const permissions = usePermissions();
    user = permissions.user;
    canAccess = permissions.canAccess;
    logout = permissions.logout;
    isAdmin = permissions.isAdmin;
    isEmpleado = permissions.isEmpleado;
  } catch (error) {
    console.log('Sistema de permisos no disponible, usando modo temporal');
  }

  // Crear items dinámicamente según el rol
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { icon: FaHome, label: "Inicio", path: "/dashboard", section: "dashboard" },
      { icon: FaCut, label: "Servicios", path: "/servicios", section: "servicios" },
      { icon: FaCalendarAlt, label: "Turnos", path: "/turnos", section: "turnos" },
      { icon: FaUserFriends, label: "Clientes", path: "/clientes", section: "clientes" },
      { icon: FaBoxOpen, label: "Productos", path: "/stock", section: "productos" },
    ];

    // Para empleados: agregar facturación
    if (isEmpleado) {
      baseItems.push({ icon: FaClipboardList, label: "Facturación", path: "/facturacion", section: "facturacion" });
    }
    
    // Para admins: agregar reportes (además de facturación)
    if (isAdmin) {
      baseItems.push({ icon: FaClipboardList, label: "Reportes", path: "/reportes", section: "reportes" });
    }

    // Agregar usuarios y configuración solo para admins
    if (isAdmin) {
      baseItems.push(
        { icon: FaUserCog, label: "Usuarios", path: "/usuarios", section: "usuarios" },
        { icon: FaCog, label: "Configuración", path: "/configuracion", section: "configuracion" }
      );
    }

    return baseItems;
  };

  // Obtener items visibles para este usuario
  const visibleNavItems = getNavItems().filter((item) => {
    try {
      return canAccess(item.section);
    } catch {
      return true;
    }
  });

  return (
    <nav className="navbar-vertical">
      <div className="navbar-logo">
        <span className="navbar-avatar">TRIMLY</span>
      </div>

      {/* Información del usuario */}
      <div className="navbar-user-info">
        <div className="navbar-user-avatar">
          <FaUser className="navbar-user-icon" />
        </div>
        <div className="navbar-user-details">
          <span className="navbar-user-name">
            {user?.nombre || 'Usuario'} {user?.apellido || 'Temporal'}
          </span>
          <span className="navbar-user-role">
            {isAdmin ? 'Administrador' : isEmpleado ? 'Empleado' : 'Temporal'}
          </span>
        </div>
      </div>

      {/* Menu de navegación */}
      <ul className="navbar-menu">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <li key={item.label} className="navbar-menu-item-wrapper">
              <Link
                to={item.path}
                className={`navbar-menu-item${isActive ? " active" : ""}`}
                title={item.label}
              >
                <Icon className="navbar-icon" />
              </Link>
              {/* Tooltip */}
              <span className="navbar-tooltip">{item.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Botón de logout sin emoji */}
      <div className="navbar-logout">
        <button
          onClick={logout}
          className="navbar-logout-btn"
          title="Cerrar sesión"
        >
          <FaSignOutAlt className="logout-icon" />
          <span className="logout-text">Salir</span>
        </button>
        <span className="navbar-tooltip">Cerrar sesión</span>
      </div>
    </nav>
  );
};

export default Navbar;