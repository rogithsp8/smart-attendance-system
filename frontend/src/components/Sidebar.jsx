import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, onLogout, isDarkMode, toggleDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '🏠', role: 'ADMIN' },
    { path: '/faculty', label: 'Dashboard', icon: '🏠', role: 'FACULTY' },
    { path: '/student', label: 'Dashboard', icon: '🏠', role: 'STUDENT' },
  ];

  const filteredMenuItems = menuItems.filter(item => item.role === user?.role);

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-20 ${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎓</div>
              <span className="text-xl font-bold text-indigo-600">SCAAS</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? '☰' : '✕'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors mb-2 ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {typeof toggleDarkMode === 'function' && (
            <button 
              onClick={toggleDarkMode} 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full mb-2 text-gray-700"
            >
              <span className="text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
              {!isCollapsed && <span className="font-medium">Dark Mode</span>}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-red-600"
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
