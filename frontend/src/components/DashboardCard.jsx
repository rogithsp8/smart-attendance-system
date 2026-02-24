import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
  };

  return (
    <div className={`${bgColors[color]} rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
