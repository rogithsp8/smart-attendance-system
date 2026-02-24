import React from 'react';

const Navbar = ({ user, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
