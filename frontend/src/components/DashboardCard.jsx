import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: 'card-blue',
    green: 'card-green',
    yellow: 'card-yellow',
    red: 'card-red',
    indigo: 'card-indigo',
    purple: 'card-purple',
  };

  return (
    <div className={`card ${colorClasses[color]}`}>
      <div className="card-content">
        <div className="card-text">
          <p className="card-title">{title}</p>
          <p className="card-value">{value}</p>
          {subtitle && (
            <p className="card-subtitle">{subtitle}</p>
          )}
        </div>
        <div className="card-icon">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
