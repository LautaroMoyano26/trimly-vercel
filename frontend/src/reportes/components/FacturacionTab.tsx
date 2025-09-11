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
  servicio: string;
  descripcion: string;
  duracion: number;
  precio: number;
  estado: boolean;
}

interface Turno {
  id: number;
  clienteId: number;
  servicioId: number;
  cliente: { nombre: string };
  servicio: { servicio: string; precio: number };
  fecha: string;
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
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [turnosPendientes, setTurnosPendientes] = useState<Turno[]>([]);
  const [itemsFactura, setItemsFactura] = useState<ItemFactura[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<string>("");

  const mostrarMensaje = (texto: string, tipo: string) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  // Añade esta función después de mostrarMensaje
  const calcularStockDisponible = (productoId: number): number => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return 0;

    // Buscar si el producto ya está en la factura
    const enFactura = itemsFactura.find(
      (item) => item.productoId === productoId
    );

    // Si está en la factura, restar la cantidad ya seleccionada
    const cantidadReservada = enFactura ? enFactura.cantidad : 0;

    // Retornar el stock real disponible
    return producto.stock - cantidadReservada;
  };
  // Agregar un turno a la factura
  const seleccionarTurno = (turno: Turno) => {
    const itemExistente = itemsFactura.find(
      (item) => item.productoId === turno.id
    );

    if (itemExistente) {
      mostrarMensaje(
        `${turno.cliente.nombre} - ${turno.servicio.servicio} ya está agregado.`,
        "error"
      );
      return;
    }

    setItemsFactura([
      ...itemsFactura,
      {
        productoId: turno.id, // ID del turno
        nombre: `${turno.cliente.nombre} - ${turno.servicio.servicio}`, // Nombre del cliente y servicio
        cantidad: 1, // En este caso, el turno es siempre una unidad
        precioUnitario: turno.servicio.precio, // Precio del servicio
        stockDisponible: 999, // Stock no aplicable para turnos, puedes asignar un número alto
      },
    ]);

    mostrarMensaje(
      `${turno.cliente.nombre} - ${turno.servicio.servicio} agregado a la factura`,
      "exito"
    );
  };

  // Agregar un producto a la factura
  const agregarProducto = (producto: Producto) => {
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

  // Agregar un servicio a la factura
  const agregarServicio = (servicio: Servicio) => {
    const itemExistente = itemsFactura.find(
      (item) =>
        item.productoId === servicio.id && item.nombre === servicio.servicio
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

  // Función para incrementar la cantidad de un producto/servicio
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

  // Función para decrementar la cantidad de un producto/servicio
  const decrementarCantidad = (productoId: number) => {
    const item = itemsFactura.find((item) => item.productoId === productoId);
    if (!item) return;

    if (item.cantidad <= 1) {
      // Eliminar el producto si la cantidad es 1 y se quiere decrementar
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

  // Función para eliminar un producto/servicio de la factura
  const eliminarProducto = (productoId: number) => {
    setItemsFactura((items) =>
      items.filter((item) => item.productoId !== productoId)
    );
  };

  // Calcular el total de la factura
  const total = itemsFactura.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0
  );

  // Obtener los productos desde el backend
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
        mostrarMensaje("Error al cargar los productos", "error");
      }
    };

    cargarProductos();
  }, []);

  // Obtener los servicios activos desde el backend
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

  // Obtener los turnos pendientes de cobro
  useEffect(() => {
    const cargarTurnosPendientes = async () => {
      try {
        const res = await fetch("http://localhost:3000/turnos");
        if (!res.ok) {
          throw new Error("Error al cargar los turnos");
        }
        const data = await res.json();
        setTurnosPendientes(data);
      } catch (error) {
        console.error("Error al cargar los turnos:", error);
        mostrarMensaje("Error al cargar los turnos", "error");
      }
    };

    cargarTurnosPendientes();
  }, []);

  // Calcular la demora de los turnos
  const calcularDemora = (fechaTurno: string) => {
    const fechaActual = new Date();
    const fechaTurnoDate = new Date(fechaTurno);
    const diferenciaTiempo = fechaActual.getTime() - fechaTurnoDate.getTime();
    const diasDeDemora = Math.floor(diferenciaTiempo / (1000 * 3600 * 24));
    return diasDeDemora;
  };

  // Asignar el color del badge según los días de demora
  const obtenerColorBadge = (dias: number) => {
    if (dias <= 0) return "green"; // Hoy
    if (dias <= 2) return "yellow"; // 1-2 días
    if (dias <= 7) return "orange"; // 3-7 días
    return "red"; // Más de 8 días
  };

  const finalizarFactura = async () => {
    try {
      // Obtener clienteId del primer turno seleccionado
      const turnoItem = itemsFactura.find((item) =>
        item.nombre.includes(" - ")
      );
      let clienteId = null;
      if (turnoItem) {
        const turno = turnosPendientes.find(
          (t) => t.id === turnoItem.productoId
        );
        clienteId = turno?.clienteId;
      }

      if (!clienteId) {
        mostrarMensaje(
          "Debes seleccionar al menos un turno para facturar.",
          "error"
        );
        return;
      }

      const detalles = itemsFactura.map((item) => {
        // Si el nombre tiene " - " es un turno/servicio asociado a turno
        if (item.nombre.includes(" - ")) {
          const turno = turnosPendientes.find((t) => t.id === item.productoId);
          return {
            tipo_item: "servicio",
            itemId: turno?.servicioId ?? Number(item.productoId), // id del servicio real
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            subtotal: Number(item.cantidad) * Number(item.precioUnitario),
            turnoId: turno?.id ? Number(turno.id) : undefined,
          };
        } else if (servicios.some((s) => s.id === item.productoId)) {
          // Es un servicio agregado directamente
          return {
            tipo_item: "servicio",
            itemId: Number(item.productoId), // id del servicio
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            subtotal: Number(item.cantidad) * Number(item.precioUnitario),
          };
        } else {
          // Es producto
          return {
            tipo_item: "producto",
            itemId: Number(item.productoId),
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            subtotal: Number(item.cantidad) * Number(item.precioUnitario),
          };
        }
      });

      const payload = {
        clienteId,
        detalles,
      };

      const res = await fetch("http://localhost:3000/facturacion/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al finalizar la factura");

      mostrarMensaje("Factura finalizada correctamente", "exito");
      setItemsFactura([]);
    } catch (error) {
      mostrarMensaje("Error al finalizar la factura", "error");
    }
  };

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
        {/* Panel de turnos pendientes (ahora ocupará toda la anchura) */}
        <div className="panel-turnos">
          <h3>Turnos Pendientes de Cobro</h3>
          <div>
            {turnosPendientes.length === 0 ? (
              <div className="vacio">No hay turnos pendientes de cobro</div>
            ) : (
              turnosPendientes.map((turno) => {
                const diasDeDemora = calcularDemora(turno.fecha);
                const colorBadge = obtenerColorBadge(diasDeDemora);

                return (
                  <div
                    key={turno.id}
                    className={`card-item ${
                      itemsFactura.some((item) => item.productoId === turno.id)
                        ? "seleccionado"
                        : ""
                    }`}
                    onClick={() => seleccionarTurno(turno)}
                  >
                    <div>
                      <div className="nombre-item">{turno.cliente.nombre}</div>
                      <div className="precio-item">
                        {turno.servicio.servicio}
                      </div>
                      <div className="servicio-info">
                        <small>Fecha: {turno.fecha}</small>
                      </div>
                    </div>
                    <span className={`badge ${colorBadge}`}>
                      {diasDeDemora} días
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel para productos y servicios (con dos columnas) */}
        <div className="panel-productos-servicios">
          {/* Panel de servicios (ahora a la izquierda) */}
          <div className="panel">
            <h3>Servicios Disponibles</h3>
            <div>
              {servicios.length === 0 ? (
                <div className="vacio">No hay servicios disponibles</div>
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

          {/* Panel de productos (ahora a la derecha) */}
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
                      <div className="precio-item">
                        Precio: ${producto.precio}
                      </div>
                      <div
                        className={`stock-item ${
                          calcularStockDisponible(producto.id) > 0
                            ? "stock-ok"
                            : "stock-error"
                        }`}
                      >
                        Stock: {calcularStockDisponible(producto.id)}
                        {calcularStockDisponible(producto.id) !==
                          producto.stock && (
                          <span className="stock-original">
                            {" "}
                            (de {producto.stock})
                          </span>
                        )}
                      </div>
                      <div className="producto-info">
                        <small>
                          {producto.categoria} - {producto.marca}
                        </small>
                      </div>
                    </div>
                    <button
                      onClick={() => agregarProducto(producto)}
                      disabled={calcularStockDisponible(producto.id) <= 0}
                      className={`btn-agregar producto ${
                        calcularStockDisponible(producto.id) <= 0
                          ? "disabled"
                          : ""
                      }`}
                      title={
                        calcularStockDisponible(producto.id) <= 0
                          ? "Sin stock"
                          : "Agregar producto"
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de factura (sin cambios) */}
      <div className="panel">
        <h3>Detalle de Factura</h3>
        {itemsFactura.length === 0 ? (
          <div className="vacio">No hay productos ni turnos agregados</div>
        ) : (
          <>
            <table className="tabla-factura">
              <thead>
                <tr>
                  <th>Producto/Servicio</th>
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
                          disabled={item.cantidad <= 1} // Deshabilitar decremento si cantidad es 1
                        >
                          <FaMinus size={10} />
                        </button>
                        <span>{item.cantidad}</span> {/* Cantidad centrada */}
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
                      <button onClick={() => eliminarProducto(item.productoId)}>
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

            <button className="btn-finalizar" onClick={finalizarFactura}>
              Finalizar Factura
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FacturacionTab;
