import React, { useState, useEffect } from "react";
import "./NuevoProductoModal.css";

interface Props {
  show: boolean;
  onClose: () => void;
  onProductoCreado: (nuevoProducto: any) => void;
}

export default function NuevoProductoModal({ show, onClose, onProductoCreado }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    precio: "",
    stock: "",
    estado: "",
  });

  // Función que determina el estado según el stock
  const calcularEstado = (stockStr: string): string => {
    const stockNum = parseInt(stockStr);
    if (isNaN(stockNum)) return "";
    if (stockNum <= 5) return "Bajo";
    if (stockNum <= 30) return "Medio";
    return "Alto";
  };

  // Cada vez que cambia el stock, actualizar estado
  useEffect(() => {
    const nuevoEstado = calcularEstado(form.stock);
    setForm((prev) => ({ ...prev, estado: nuevoEstado }));
  }, [form.stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar nombre duplicado
    try {
      const res = await fetch("http://localhost:3000/producto");
      const productos = await res.json();
      const existe = productos.some(
        (p: any) => p.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (existe) {
        alert("Ya existe un producto con ese nombre.");
        return;
      }
    } catch (error) {
      alert("No se pudo validar si el producto ya existe.");
      return;
    }

    // Enviar nuevo producto
    try {
      const res = await fetch("http://localhost:3000/producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
          estado: form.estado || "Alto",
        }),
      });
      if (!res.ok) {
        alert("Error al crear el producto. Verifica los datos o el servidor.");
        return;
      }
      const nuevoProducto = await res.json();
      onProductoCreado(nuevoProducto);
      onClose();
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-bg2">
      <div className="nuevo-producto-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Nuevo Producto</h2>
        <p className="modal-subtitle">Agrega un nuevo producto al inventario</p>
        <form onSubmit={handleSubmit}>

          {/* Nombre del producto - fila completa */}
          <div className="nuevo-input-group">
            <label>Nombre del producto</label>
            <input
              name="nombre"
              placeholder="Ej: Shampoo revitalizante"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Precio y Stock lado a lado */}
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>Precio</label>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="nuevo-input-group">
              <label>Stock inicial</label>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
              {form.estado && (
                <small
                  style={{
                    marginTop: "4px",
                    display: "block",
                    fontWeight: "bold",
                    color:
                      form.estado === "Alto"
                        ? "green"
                        : form.estado === "Medio"
                        ? "orange"
                        : "red",
                  }}
                >
                  Estado: {form.estado}
                </small>
              )}
            </div>
          </div>

          {/* Categoría fila completa */}
          <div className="nuevo-input-group">
            <label>Categoría</label>
            <input
              name="categoria"
              placeholder="Seleccionar categoría"
              value={form.categoria}
              onChange={handleChange}
              required
            />
          </div>

          {/* Proveedor (marca) fila completa */}
          <div className="nuevo-input-group">
            <label>Proveedor</label>
            <input
              name="marca"
              placeholder="Ej: L'Oréal"
              value={form.marca}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botones */}
          <div className="form-row buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="create-btn">Crear producto</button>
          </div>

        </form>
      </div>
    </div>
  );
}
