import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'info' | 'danger';
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, variant, icon }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
