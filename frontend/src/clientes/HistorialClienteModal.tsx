// Archivo: frontend/src/clientes/HistorialClienteModal.tsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaCut,
  FaBoxOpen,
  FaUser,
  FaSort,
} from "react-icons/fa";
import "./HistorialClienteModal.css";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
}

interface TurnoHistorial {
  id: number;
  fecha: string;
  hora: string;
  servicio: {
    id: number;
    servicio: string;
    precio: number;
  };
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  notas?: string;
  estado: string;
}

interface FacturaDetalle {
  id: number;
  tipo_item: "producto" | "servicio";
  itemId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface FacturaHistorial {
  id: number;
  metodoPago: string;
  estado: string;
  createdAt: string;
  detalles: FacturaDetalle[];
}

interface Props {
  show: boolean;
  onClose: () => void;
  cliente: Cliente | null;
}

const HistorialClienteModal: React.FC<Props> = ({ show, onClose, cliente }) => {
  const [activeTab, setActiveTab] = useState<
    "turnos" | "servicios" | "productos"
  >("turnos");
  const [turnos, setTurnos] = useState<TurnoHistorial[]>([]);
  const [facturas, setFacturas] = useState<FacturaHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (show && cliente) {
      cargarHistorial();
    }
  }, [show, cliente]);

  const cargarHistorial = async () => {
    if (!cliente) return;

    setLoading(true);
    try {
      // Cargar turnos del cliente
      const turnosRes = await fetch(
        `http://localhost:3000/clientes/${cliente.id}/turnos`
      );
      if (turnosRes.ok) {
        const turnosData = await turnosRes.json();
        setTurnos(turnosData);
      } else {
        console.error("Error cargando turnos:", turnosRes.status);
        setTurnos([]);
      }

      // Cargar facturas del cliente
      const facturasRes = await fetch(
        `http://localhost:3000/clientes/${cliente.id}/facturas`
      );
      if (facturasRes.ok) {
        const facturasData = await facturasRes.json();
        setFacturas(facturasData);
      } else {
        console.error("Error cargando facturas:", facturasRes.status);
        setFacturas([]);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      setTurnos([]);
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearFechaHora = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función segura para formatear precios
  const formatearPrecio = (precio: any) => {
    const num = parseFloat(precio);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Obtener servicios desde facturas
  const serviciosFacturados = facturas.flatMap((factura) =>
    factura.detalles
      .filter((detalle) => detalle.tipo_item === "servicio")
      .map((detalle) => ({
        ...detalle,
        fecha: factura.createdAt,
        metodoPago: factura.metodoPago,
        facturaId: factura.id,
        nombre: `Servicio #${detalle.itemId}`, // Por ahora usamos el ID hasta tener el endpoint
      }))
  );

  // Obtener productos desde facturas
  const productosFacturados = facturas.flatMap((factura) =>
    factura.detalles
      .filter((detalle) => detalle.tipo_item === "producto")
      .map((detalle) => ({
        ...detalle,
        fecha: factura.createdAt,
        metodoPago: factura.metodoPago,
        facturaId: factura.id,
        nombre: `Producto #${detalle.itemId}`, // Por ahora usamos el ID hasta tener el endpoint
      }))
  );

  // Función de ordenamiento
  const ordenarPorFecha = (items: any[]) => {
    return [...items].sort((a, b) => {
      const fechaA = new Date(a.fecha || a.createdAt);
      const fechaB = new Date(b.fecha || b.createdAt);
      return sortAsc
        ? fechaA.getTime() - fechaB.getTime()
        : fechaB.getTime() - fechaA.getTime();
    });
  };

  if (!show || !cliente) return null;

  return (
    <div className="historial-modal-overlay">
      <div className="historial-modal-content">
        <div className="historial-modal-header">
          <div className="cliente-info-header">
            <div className="cliente-avatar">
              <FaUser size={32} />
            </div>
            <div>
              <h2 className="cliente-nombre">
                {cliente.nombre} {cliente.apellido}
              </h2>
              <div className="cliente-contacto">
                <span>{cliente.telefono}</span>
                <span>{cliente.email}</span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="historial-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === "turnos" ? "active" : ""}`}
              onClick={() => setActiveTab("turnos")}
            >
              <FaCalendarAlt />
              Turnos ({turnos.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "servicios" ? "active" : ""}`}
              onClick={() => setActiveTab("servicios")}
            >
              <FaCut />
              Servicios ({serviciosFacturados.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "productos" ? "active" : ""}`}
              onClick={() => setActiveTab("productos")}
            >
              <FaBoxOpen />
              Productos ({productosFacturados.length})
            </button>
          </div>

          <div className="sort-controls">
            <button
              className="sort-btn"
              onClick={() => setSortAsc(!sortAsc)}
              title={`Ordenar ${
                sortAsc ? "más recientes primero" : "más antiguos primero"
              }`}
            >
              <FaSort />
              {sortAsc ? "Más antiguos" : "Más recientes"}
            </button>
          </div>
        </div>

        <div className="historial-content">
          {loading ? (
            <div className="loading-state">Cargando historial...</div>
          ) : (
            <>
              {/* Tab de Turnos */}
              {activeTab === "turnos" && (
                <div className="tab-content">
                  {turnos.length === 0 ? (
                    <div className="empty-state">
                      <FaCalendarAlt size={48} />
                      <p>No hay turnos registrados</p>
                    </div>
                  ) : (
                    <div className="historial-list">
                      {ordenarPorFecha(turnos).map((turno) => (
                        <div key={turno.id} className="historial-item">
                          <div className="historial-icon turnos">
                            <FaCalendarAlt />
                          </div>
                          <div className="historial-info">
                            <div className="historial-title">
                              {turno.servicio?.servicio ||
                                "Servicio no disponible"}
                            </div>
                            <div className="historial-meta">
                              <span className="fecha">
                                {formatearFecha(turno.fecha)} - {turno.hora}
                              </span>
                              {turno.usuario && (
                                <span className="profesional">
                                  Peluquero: {turno.usuario.nombre}{" "}
                                  {turno.usuario.apellido}
                                </span>
                              )}
                              <span className={`estado estado-${turno.estado}`}>
                                {turno.estado.charAt(0).toUpperCase() +
                                  turno.estado.slice(1)}
                              </span>
                            </div>
                            {turno.notas && (
                              <div className="historial-notas">
                                {turno.notas}
                              </div>
                            )}
                          </div>
                          <div className="historial-value">
                            ${formatearPrecio(turno.servicio?.precio)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab de Servicios */}
              {activeTab === "servicios" && (
                <div className="tab-content">
                  {serviciosFacturados.length === 0 ? (
                    <div className="empty-state">
                      <FaCut size={48} />
                      <p>No hay servicios registrados</p>
                    </div>
                  ) : (
                    <div className="historial-list">
                      {ordenarPorFecha(serviciosFacturados).map(
                        (servicio, index) => (
                          <div
                            key={`servicio-${index}`}
                            className="historial-item"
                          >
                            <div className="historial-icon servicios">
                              <FaCut />
                            </div>
                            <div className="historial-info">
                              <div className="historial-title">
                                {servicio.nombre}
                              </div>
                              <div className="historial-meta">
                                <span className="fecha">
                                  {formatearFechaHora(servicio.fecha)}
                                </span>
                                <span className="cantidad">
                                  Cantidad: {servicio.cantidad}
                                </span>
                                <span className="metodo-pago">
                                  Pago: {servicio.metodoPago}
                                </span>
                                <span className="factura">
                                  Factura #{servicio.facturaId}
                                </span>
                              </div>
                            </div>
                            <div className="historial-value">
                              ${formatearPrecio(servicio.subtotal)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab de Productos */}
              {activeTab === "productos" && (
                <div className="tab-content">
                  {productosFacturados.length === 0 ? (
                    <div className="empty-state">
                      <FaBoxOpen size={48} />
                      <p>No hay productos registrados</p>
                    </div>
                  ) : (
                    <div className="historial-list">
                      {ordenarPorFecha(productosFacturados).map(
                        (producto, index) => (
                          <div
                            key={`producto-${index}`}
                            className="historial-item"
                          >
                            <div className="historial-icon productos">
                              <FaBoxOpen />
                            </div>
                            <div className="historial-info">
                              <div className="historial-title">
                                {producto.nombre}
                              </div>
                              <div className="historial-meta">
                                <span className="fecha">
                                  {formatearFechaHora(producto.fecha)}
                                </span>
                                <span className="cantidad">
                                  Cantidad: {producto.cantidad}
                                </span>
                                <span className="precio-unit">
                                  Precio unit: $
                                  {formatearPrecio(producto.precioUnitario)}
                                </span>
                                <span className="metodo-pago">
                                  Pago: {producto.metodoPago}
                                </span>
                                <span className="factura">
                                  Factura #{producto.facturaId}
                                </span>
                              </div>
                            </div>
                            <div className="historial-value">
                              ${formatearPrecio(producto.subtotal)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialClienteModal;
