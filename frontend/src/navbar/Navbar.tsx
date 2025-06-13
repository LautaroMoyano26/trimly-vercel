import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCut,
  FaCalendarAlt,
  FaUserFriends,
  FaInbox,
  FaClipboardList,
  FaUserCog,
  FaCog,
} from "react-icons/fa";
import "./Navbar.css";

const navItems = [
  { icon: <FaHome />, label: "Inicio", path: "/" },
  { icon: <FaCut />, label: "Servicios", path: "/servicios" },
  { icon: <FaCalendarAlt />, label: "Turnos", path: "/turnos" },
  { icon: <FaUserFriends />, label: "Clientes", path: "/clientes" },
  { icon: <FaInbox />, label: "Mensajes", path: "/mensajes" },
  { icon: <FaClipboardList />, label: "Tareas", path: "/tareas" },
  { icon: <FaUserCog />, label: "Usuarios", path: "/usuarios" },
  { icon: <FaCog />, label: "Configuración", path: "/configuracion" },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar-vertical d-flex flex-column align-items-center py-3">
      <div className="navbar-logo mb-4 d-none d-md-flex align-items-center justify-content-center">
        <span className="navbar-avatar">TRIMLY</span>
      </div>
      <ul className="navbar-menu list-unstyled mb-0 w-100 d-flex flex-md-column flex-row justify-content-center align-items-center gap-3 gap-md-0">
        {navItems.map((item) => (
          <li
            key={item.label}
            className={`navbar-menu-item d-flex justify-content-center align-items-center my-2 ${
              location.pathname === item.path ? "active" : ""
            }`}
            title={item.label}
            style={{ width: "100%" }}
          >
            <Link to={item.path} style={{ color: "inherit", textDecoration: "none", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;