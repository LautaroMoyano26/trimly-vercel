import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ target, percentage }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <div className="progress-bar-text">
        Objetivo: ${target.toLocaleString('es-AR')} ({percentage}%)
      </div>
    </div>
  );
};

export default ProgressBar;
