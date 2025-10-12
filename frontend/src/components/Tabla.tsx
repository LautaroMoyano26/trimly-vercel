import React from "react";

interface TablaProps {
  columns: { key: string; label: string }[];
  data: any[];
  maxVisibleRows?: number;
}

const Tabla: React.FC<TablaProps> = ({ columns, data }) => {
  return (
    <div className="table-responsive rounded-4">
      <table className="table table-dark table-borderless align-middle mb-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;