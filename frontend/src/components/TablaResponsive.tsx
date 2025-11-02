import React from "react";
import "./TablaResponsive.css";

export interface ColumnaTabla {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  icon?: React.ReactNode;
}

interface TablaResponsiveProps {
  columns: ColumnaTabla[];
  data: any[];
  keyExtractor: (item: any) => string | number;
  className?: string;
}

const TablaResponsive: React.FC<TablaResponsiveProps> = ({
  columns,
  data,
  keyExtractor,
  className = "",
}) => {
  return (
    <div className={`tabla-responsive-wrapper ${className}`}>
      <table className="tabla-responsive">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.icon && <span className="th-icon">{col.icon}</span>}
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResponsive;
