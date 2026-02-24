import React from 'react';

const Navbar = ({ user, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1>Welcome, {user?.name}</h1>
        </div>

        <div className="navbar-right">
          {/* Notifications */}
          <button className="nav-button">
            🔔
            <span className="notification-dot"></span>
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
            <div className="user-avatar">
              👤
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
