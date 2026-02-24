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
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-brand">
              <div className="brand-icon">🎓</div>
              <span className="brand-text">SCAAS</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-toggle"
          >
            {isCollapsed ? '☰' : '✕'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {typeof toggleDarkMode === 'function' && (
            <button onClick={toggleDarkMode} className="footer-item">
              <span className="nav-icon">{isDarkMode ? '🌙' : '☀️'}</span>
              {!isCollapsed && <span className="nav-label">Dark Mode</span>}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="footer-item logout"
          >
            <span className="nav-icon">🚪</span>
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
