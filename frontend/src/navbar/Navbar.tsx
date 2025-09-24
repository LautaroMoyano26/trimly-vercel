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
} from "react-icons/fa";
import "./Navbar.css";

const navItems = [
  { icon: FaHome, label: "Inicio", path: "/" },
  { icon: FaCut, label: "Servicios", path: "/servicios" },
  { icon: FaCalendarAlt, label: "Turnos", path: "/turnos" },
  { icon: FaUserFriends, label: "Clientes", path: "/clientes" },
  { icon: FaBoxOpen, label: "Productos", path: "/stock" },
  { icon: FaClipboardList, label: "Reportes y facturación", path: "/reportes" }, // ✅ CAMBIO AQUÍ
  { icon: FaUserCog, label: "Usuarios", path: "/usuarios" },
  { icon: FaCog, label: "Configuración", path: "/configuracion" },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar-vertical">
      <div className="navbar-logo">
        <span className="navbar-avatar">TRIMLY</span>
      </div>
      <ul className="navbar-menu">
        {navItems.map((item) => {
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
    </nav>
  );
};

export default Navbar;