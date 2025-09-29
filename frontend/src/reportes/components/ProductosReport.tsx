import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import type { ReporteProducto } from '../types/reportes.types';
import './ProductosReport.css';

interface ProductosReportProps {
  productos: ReporteProducto[];
  periodo: string;
  totalProductos: number;
  totalProductosVendidos: number;
}

export const ProductosReport: React.FC<ProductosReportProps> = ({
  productos,
  periodo,
  totalProductos,
  totalProductosVendidos
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getStockColorClass = (stock: number) => {
    if (stock >= 10) return 'producto-stock-high';
    if (stock >= 5) return 'producto-stock-medium';
    if (stock > 0) return 'producto-stock-low';
    return 'producto-stock-none';
  };

  return (
    <div className="productos-report-container">
      <h3 className="productos-report-title">
        Análisis de Productos - {periodo}
      </h3>

      <div className="productos-list">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-item">
            <div className="producto-left">
              <div className="producto-icon">
                <Package size={20} color="#00e6e6" />
              </div>
              <div className="producto-info">
                <h4>{producto.nombre}</h4>
                <p>{producto.unidadesVendidas} unidades vendidas</p>
              </div>
            </div>

            <div className="producto-right">
              <div className="producto-ingresos">
                {formatCurrency(producto.ingresos)}
              </div>
              <div className="producto-badges">
                <div className={`producto-stock-badge ${getStockColorClass(producto.stock)}`}>
                  Stock: {producto.stock}
                </div>
                <div className="producto-tendencia">
                  +{producto.tendencia}%
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Fila de totales */}
        <div className="productos-total">
          <div className="productos-total-left">
            <div className="productos-total-icon">
              <ShoppingCart size={20} color="#00e6e6" />
            </div>
            <div className="productos-total-info">
              <h4>Total Productos</h4>
              <p>{totalProductosVendidos} productos vendidos</p>
            </div>
          </div>
          <div className="productos-total-right">
            <div className="productos-total-amount">
              {formatCurrency(totalProductos)}
            </div>
            <p className="productos-total-label">
              Ingresos totales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};