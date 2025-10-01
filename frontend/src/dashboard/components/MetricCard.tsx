import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  children,
}) => {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-card-title">{title}</span>
        <div className="metric-card-icon" style={{ backgroundColor: iconBgColor }}>
          {icon}
        </div>
      </div>
      <div className="metric-card-value">{value}</div>
      {children && <div className="metric-card-content">{children}</div>}
    </div>
  );
};

export default MetricCard;
