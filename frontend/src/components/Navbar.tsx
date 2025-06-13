import React from "react";
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

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-avatar">TRYMLY</div>
      <ul className="navbar-menu">
        <li>
          <FaHome />
        </li>
        <li>
          <FaCut />
        </li>
        <li>
          <FaCalendarAlt />
        </li>
        <li className="active">
          <FaUserFriends />
        </li>
        <li>
          <FaInbox />
        </li>
        <li>
          <FaClipboardList />
        </li>
        <li>
          <FaUserCog />
        </li>
        <li>
          <FaCog />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;