import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./turno.css";
import NuevoTurnoModal from "./NuevoTurnoModal";

export default function Turnos() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="turnos-container">
      <h2 id="titulo">Turnos</h2>
      <button
        className="nuevo-turno-btn"
        onClick={() => setShowModal(true)}
      >
        <FaPlus /> Nuevo Turno
      </button>
      <NuevoTurnoModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
    );
  }