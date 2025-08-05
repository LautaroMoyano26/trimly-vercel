import React from "react";
import "./SuccessModal.css";

interface Props {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ show, message, onClose }: Props) {
  if (!show) return null;
  return (
    <div className="modal-bg">
      <div className="success-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">¡Éxito!</h2>
        <p className="modal-message">{message}</p>
        <button className="create-btn" onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
}
