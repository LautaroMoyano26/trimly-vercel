import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaEdit, FaTrash } from "react-icons/fa";
import "./ProductosDashboard.css";
import NuevoProductoModal from "./NuevoProductoModal"; 

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  precio: number;
  stock: number;
  estado: "Alto" | "Medio" | "Bajo";
}

export default function ProductosDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:3000/producto"); 
        const data = await res.json();
        setProductos(data); 
      } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("No se pudieron cargar los productos.");
      }
    };

    cargarProductos();
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
        <button
          className="nuevo-producto-btn"
          onClick={() => setShowModal(true)} 
        >
          + Nuevo producto
        </button>
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
            <th>Marca</th>
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
              <td>{p.marca}</td>
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

      <NuevoProductoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onProductoCreado={(nuevoProducto) => {
          setProductos((prev) => [...prev, nuevoProducto]);
          setShowModal(false);
        }}
      />
    </div>
  );
}
