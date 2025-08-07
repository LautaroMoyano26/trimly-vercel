import React from "react";
import { FaPlus } from "react-icons/fa";
import "./turno.css";

export default function Turnos() {
  return (
    <div className="turnos-container">
      <h2 id="titulo">Turnos</h2>
      <button className="nuevo-turno-btn">
        <FaPlus /> Nuevo Turno
      </button>
    </div>
  );
}