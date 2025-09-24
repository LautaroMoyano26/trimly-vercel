
import "./ErrorModal.css";  // Asegúrate de importar el CSS

interface Props {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ show, message, onClose }: Props) {
  if (!show) return null;

  return (
    <div className="modal-bg">
      <div className="error-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">¡Error!</h2>
        <p className="modal-message">{message}</p>
        <button className="create-btn" onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
}
