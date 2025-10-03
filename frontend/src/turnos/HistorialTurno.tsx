import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import "./HistorialTurno.css";

interface Props {
  show: boolean;
  onClose: () => void;
}

interface Cliente {
  nombre: string;
  apellido: string;
}

interface Servicio {
  servicio: string;
  precio: number;
}

interface Usuario {
  nombre: string;
  apellido: string;
}

interface Factura {
  estado: 'pendiente' | 'cobrada' | 'cancelada';
  createdAt: string;
  
}

interface Turno {
  id: number;
  cliente: Cliente | null;
  servicio: Servicio | null;
  fecha: string;
  hora: string; // "HH:MM:SS"
  usuario: Usuario | null;
  factura?: Factura | null;
}

const HistorialTurnosModal: React.FC<Props> = ({ show, onClose }) => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;

    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/turnos")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const hoy = new Date().toISOString().split("T")[0];
          const turnosHoy = data.filter((t: Turno) => t.fecha === hoy);

          // Ordenar por hora descendente
          turnosHoy.sort((a: Turno, b: Turno) =>
            (b.hora ?? "").localeCompare(a.hora ?? "")
          );

          setTurnos(turnosHoy);
        } else {
          console.error("Respuesta inesperada:", data);
          setTurnos([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando turnos:", err);
        setError("No se pudieron cargar los turnos.");
      })
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  return (
    <div className="historial-overlay">
      <div className="historial-container">
        <div className="historial-header">
          <h2>Historial de Turnos</h2>
          <p>Últimos turnos realizados y facturados</p>
        </div>

        <div className="historial-list">
          {loading && <p className="historial-empty">Cargando turnos...</p>}
          {error && <p className="historial-empty">{error}</p>}
          {!loading && !error && turnos.length === 0 && (
            <p className="historial-empty">No hay turnos registrados para hoy</p>
          )}

          {!loading &&
            !error &&
            turnos.map((turno) => {
              const estado = turno.factura?.estado === "cobrada" ? "Pagado" : "Pendiente";
              const fechaFactura = turno.factura?.createdAt?.split("T")[0] ?? null;
              const horaMostrar = turno.hora?.slice(0, 5) ?? "-";

              return (
                <div key={turno.id} className="historial-card">
                  <div className="historial-icon">
                    <FaClock />
                  </div>

                  <div className="historial-info">
                    <h3>
                      {turno.cliente
                        ? `${turno.cliente.nombre} ${turno.cliente.apellido}`
                        : "Sin cliente"}
                    </h3>

                    <p>{turno.servicio?.servicio ?? "Sin servicio"}</p>
                    <span>
                      {turno.fecha ?? "-"} - {horaMostrar} • Por:{" "}
                      {turno.usuario
                        ? `${turno.usuario.nombre} ${turno.usuario.apellido}`
                        : "Sin asignar"}
                    </span>

                    {estado === "Pagado" && fechaFactura && (
                      <p className="facturado">
                        Facturado el: <strong>{fechaFactura}</strong>
                      </p>
                    )}
                  </div>

                  <div className="historial-status">
                    <strong>${turno.servicio?.precio ?? 0}</strong>
                    {estado === "Pagado" ? (
                      <span className="pagado"> Pagado</span>
                    ) : (
                      <span className="pendiente">Pendiente</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="historial-footer">
          <button onClick={onClose} className="cerrar-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialTurnosModal;
