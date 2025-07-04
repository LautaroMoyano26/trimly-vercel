import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaEdit, FaTrash } from "react-icons/fa";
import "./ProductosDashboard.css";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  proveedor: string;
  precio: number;
  stock: number;
  estado: "Alto" | "Medio" | "Bajo";
}

export default function ProductosDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Aquí deberías hacer fetch a tu backend para obtener los productos
    // setProductos(data);
  }, []);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-dashboard-container">
      <div className="dashboard-header">
        <h1>Stock</h1>
        <p>Gestiona el inventario y categorías de productos</p>
      </div>
      <div className="dashboard-actions">
        <button className="tab active">Productos</button>
        <button className="tab">Categorías</button>
        <button className="nuevo-producto-btn">+ Nuevo producto</button>
      </div>
      <input
        className="busqueda-input"
        placeholder="Buscar producto por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id}>
              <td>
                <FaBoxOpen className="icono-producto" />
                {p.nombre}
              </td>
              <td>
                <span className="categoria-badge">{p.categoria}</span>
              </td>
              <td>{p.proveedor}</td>
              <td>${p.precio.toLocaleString()}</td>
              <td>
                <b>{p.stock} unidades</b>
              </td>
              <td>
                <span className={`estado-badge estado-${p.estado.toLowerCase()}`}>
                  {p.estado}
                </span>
              </td>
              <td>
                <button className="btn-accion editar">
                  <FaEdit />
                </button>
                <button className="btn-accion eliminar">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}