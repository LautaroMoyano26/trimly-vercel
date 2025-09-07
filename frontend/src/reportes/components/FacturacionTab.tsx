import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "./FacturacionTab.css";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  estado: string;
  categoria: string;
  marca: string;
}

interface Servicio {
  id: number;
  servicio: string; // Cambiamos nombre por servicio para coincidir con la BD
  descripcion: string;
  duracion: number;
  precio: number;
  estado: boolean;
}

interface ItemFactura {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
}

const FacturacionTab: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]); // Ya no inicializamos con datos hardcodeados
  const [itemsFactura, setItemsFactura] = useState<ItemFactura[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<string>("");

  const mostrarMensaje = (texto: string, tipo: string) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  const agregarProducto = (producto: Producto) => {
    if (producto.stock <= 0) {
      mostrarMensaje(`No hay stock disponible para ${producto.nombre}`, "error");
      return;
    }

    const itemExistente = itemsFactura.find(
      (item) => item.productoId === producto.id
    );

    if (itemExistente) {
      if (itemExistente.cantidad >= itemExistente.stockDisponible) {
        mostrarMensaje(
          `No se puede exceder el stock disponible para ${producto.nombre}`,
          "error"
        );
        return;
      }

      setItemsFactura((items) =>
        items.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
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

  const agregarServicio = (servicio: Servicio) => {
    const itemExistente = itemsFactura.find(
      (item) => item.productoId === servicio.id && item.nombre === servicio.servicio
    );

    if (itemExistente) {
      setItemsFactura((items) =>
        items.map((item) =>
          item.productoId === servicio.id && item.nombre === servicio.servicio
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setItemsFactura([
        ...itemsFactura,
        {
          productoId: servicio.id,
          nombre: servicio.servicio,
          cantidad: 1,
          precioUnitario: servicio.precio,
          stockDisponible: 999, // Los servicios no tienen límite de stock
        },
      ]);
    }

    mostrarMensaje(`${servicio.servicio} agregado a la factura`, "exito");
  };

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

  const eliminarProducto = (productoId: number) => {
    setItemsFactura((items) =>
      items.filter((item) => item.productoId !== productoId)
    );
  };

  const total = itemsFactura.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0
  );

  // Nuevo useEffect para cargar productos desde el backend
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:3000/producto");
        if (!res.ok) {
          throw new Error("Error al cargar productos");
        }
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        // Opcionalmente mostrar mensaje de error
        mostrarMensaje("Error al cargar los productos", "error");
      }
    };

    cargarProductos();
  }, []);

  // Cargar servicios activos desde el backend
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch("http://localhost:3000/servicios/activos");
        if (!res.ok) {
          throw new Error("Error al cargar servicios");
        }
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        mostrarMensaje("Error al cargar los servicios", "error");
      }
    };

    cargarServicios();
  }, []);

  return (
    <div className="facturacion-container">
      {mensaje && (
        <div
          className={`mensaje-notificacion ${
            tipoMensaje === "error" ? "error" : "exito"
          }`}
        >
          {mensaje}
        </div>
      )}

      <h2>Sistema de Facturación</h2>

      <div className="paneles">
        {/* Panel de servicios */}
        <div className="panel">
          <h3>Servicios Disponibles</h3>
          <div>
            {servicios.length === 0 ? (
              <div className="vacio">No hay servicios activos</div>
            ) : (
              servicios.map((servicio) => (
                <div key={servicio.id} className="card-item">
                  <div>
                    <div className="nombre-item">{servicio.servicio}</div>
                    <div className="precio-item">${servicio.precio}</div>
                    <div className="servicio-info">
                      <small>Duración: {servicio.duracion} min</small>
                    </div>
                  </div>
                  <button
                    onClick={() => agregarServicio(servicio)}
                    className="btn-agregar servicio"
                    title="Agregar servicio"
                  >
                    <FaPlus />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de productos */}
        <div className="panel">
          <h3>Productos Disponibles</h3>
          <div>
            {productos.length === 0 ? (
              <div className="vacio">No hay productos disponibles</div>
            ) : (
              productos.map((producto) => (
                <div key={producto.id} className="card-item">
                  <div>
                    <div className="nombre-item">{producto.nombre}</div>
                    <div className="precio-item">Precio: ${producto.precio}</div>
                    <div
                      className={`stock-item ${
                        producto.stock > 0 ? "stock-ok" : "stock-error"
                      }`}
                    >
                      Stock: {producto.stock}
                    </div>
                    <div className="producto-info">
                      <small>
                        {producto.categoria} - {producto.marca}
                      </small>
                    </div>
                  </div>
                  <button
                    onClick={() => agregarProducto(producto)}
                    disabled={producto.stock <= 0}
                    className={`btn-agregar producto ${
                      producto.stock <= 0 ? "disabled" : ""
                    }`}
                    title={producto.stock <= 0 ? "Sin stock" : "Agregar producto"}
                  >
                    <FaPlus />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Panel de factura */}
      <div className="panel">
        <h3>Detalle de Factura</h3>
        {itemsFactura.length === 0 ? (
          <div className="vacio">No hay servicios o productos agregados</div>
        ) : (
          <>
            <table className="tabla-factura">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {itemsFactura.map((item) => (
                  <tr key={item.productoId + item.nombre}>
                    <td>{item.nombre}</td>
                    <td>
                      <div className="cantidad-controls">
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
                    <td>${item.precioUnitario}</td>
                    <td>${item.cantidad * item.precioUnitario}</td>
                    <td>
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

            <div className="total-bar">
              <span>Total:</span>
              <span className="total">${total}</span>
            </div>

            <button className="btn-finalizar">Finalizar Factura</button>
          </>
        )}
      </div>
    </div>
  );
};

export default FacturacionTab;
