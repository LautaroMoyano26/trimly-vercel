import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

// Simple interfaces
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface ItemFactura {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
}

const FacturacionTab: React.FC = () => {
  // Mock data for demonstration
  const [productos] = useState<Producto[]>([
    { id: 1, nombre: "Shampoo Premium", precio: 3500, stock: 10 },
    { id: 2, nombre: "Acondicionador", precio: 2800, stock: 15 },
    { id: 3, nombre: "Gel Fijador", precio: 2000, stock: 0 },
    { id: 4, nombre: "Crema para Peinar", precio: 1800, stock: 8 },
  ]);

  const [itemsFactura, setItemsFactura] = useState<ItemFactura[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<string>("");

  const mostrarMensaje = (texto: string, tipo: string) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje(null);
    }, 3000);
  };

  // Agregar producto con validación de stock
  const agregarProducto = (producto: Producto) => {
    // Escenario 2: No hay stock disponible
    if (producto.stock <= 0) {
      mostrarMensaje(
        `No hay stock disponible para ${producto.nombre}`,
        "error"
      );
      return;
    }

    const itemExistente = itemsFactura.find(
      (item) => item.productoId === producto.id
    );

    if (itemExistente) {
      // Escenario 3: Verificar que no exceda el stock disponible
      if (itemExistente.cantidad >= itemExistente.stockDisponible) {
        mostrarMensaje(
          `No se puede exceder el stock disponible para ${producto.nombre}`,
          "error"
        );
        return;
      }

      // Incrementar cantidad
      setItemsFactura((items) =>
        items.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      // Escenario 1: Agregar producto nuevo con stock disponible
      setItemsFactura([
        ...itemsFactura,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precioUnitario: producto.precio,
          stockDisponible: producto.stock,
        },
      ]);
    }

    mostrarMensaje(`${producto.nombre} agregado a la factura`, "exito");
  };

  // Incrementar cantidad
  const incrementarCantidad = (productoId: number) => {
    const item = itemsFactura.find((item) => item.productoId === productoId);
    if (!item) return;

    if (item.cantidad >= item.stockDisponible) {
      mostrarMensaje(`No se puede exceder el stock disponible`, "error");
      return;
    }

    setItemsFactura((items) =>
      items.map((item) =>
        item.productoId === productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // Decrementar cantidad
  const decrementarCantidad = (productoId: number) => {
    const item = itemsFactura.find((item) => item.productoId === productoId);
    if (!item) return;

    if (item.cantidad <= 1) {
      setItemsFactura((items) =>
        items.filter((item) => item.productoId !== productoId)
      );
    } else {
      setItemsFactura((items) =>
        items.map((item) =>
          item.productoId === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
      );
    }
  };

  // Eliminar producto
  const eliminarProducto = (productoId: number) => {
    setItemsFactura((items) =>
      items.filter((item) => item.productoId !== productoId)
    );
  };

  // Calcular total
  const total = itemsFactura.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0
  );

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      {/* Mensaje de notificación */}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor:
              tipoMensaje === "error"
                ? "rgba(255,0,0,0.8)"
                : "rgba(0,128,0,0.8)",
            color: "white",
            zIndex: 1000,
          }}
        >
          {mensaje}
        </div>
      )}

      <h2>Sistema de Facturación</h2>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Panel de productos */}
        <div
          style={{ background: "#222", padding: "20px", borderRadius: "8px" }}
        >
          <h3>Productos Disponibles</h3>

          <div>
            {productos.map((producto) => (
              <div
                key={producto.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  margin: "8px 0",
                  background: "#333",
                  borderRadius: "4px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{producto.nombre}</div>
                  <div>Precio: ${producto.precio}</div>
                  <div
                    style={{
                      color: producto.stock > 0 ? "#8effba" : "#ff8e8e",
                    }}
                  >
                    Stock: {producto.stock}
                  </div>
                </div>
                <button
                  onClick={() => agregarProducto(producto)}
                  disabled={producto.stock <= 0}
                  style={{
                    background: producto.stock > 0 ? "#4e54c8" : "#555",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px",
                    cursor: producto.stock > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de factura */}
        <div
          style={{ background: "#222", padding: "20px", borderRadius: "8px" }}
        >
          <h3>Detalle de Factura</h3>

          {itemsFactura.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#999" }}
            >
              No hay productos agregados
            </div>
          ) : (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #444" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Producto
                    </th>
                    <th style={{ textAlign: "center", padding: "8px" }}>
                      Cantidad
                    </th>
                    <th style={{ textAlign: "right", padding: "8px" }}>
                      Precio
                    </th>
                    <th style={{ textAlign: "right", padding: "8px" }}>
                      Subtotal
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itemsFactura.map((item) => (
                    <tr
                      key={item.productoId}
                      style={{ borderBottom: "1px solid #333" }}
                    >
                      <td style={{ padding: "8px" }}>{item.nombre}</td>
                      <td style={{ textAlign: "center", padding: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => decrementarCantidad(item.productoId)}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span>
                            {item.cantidad}{" "}
                            <small>(max: {item.stockDisponible})</small>
                          </span>
                          <button
                            onClick={() => incrementarCantidad(item.productoId)}
                            disabled={item.cantidad >= item.stockDisponible}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", padding: "8px" }}>
                        ${item.precioUnitario}
                      </td>
                      <td style={{ textAlign: "right", padding: "8px" }}>
                        ${item.cantidad * item.precioUnitario}
                      </td>
                      <td style={{ padding: "8px" }}>
                        <button
                          onClick={() => eliminarProducto(item.productoId)}
                        >
                          <FaTrash color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  padding: "12px",
                  background: "#333",
                  borderRadius: "4px",
                }}
              >
                <span>Total:</span>
                <span style={{ fontWeight: "bold", color: "#4e54c8" }}>
                  ${total}
                </span>
              </div>

              <button
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "20px",
                  background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Finalizar Factura
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacturacionTab;
