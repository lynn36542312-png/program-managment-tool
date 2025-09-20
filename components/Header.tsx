
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onNewTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, onNewTask }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Smart Tasker</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            <button onClick={() => setView('dashboard')} className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}>
              Dashboard
            </button>
            <button onClick={() => setView('kanban')} className={`${navItemClasses} ${currentView === 'kanban' ? activeClasses : inactiveClasses}`}>
              Kanban
            </button>
          </nav>
          <div className="flex items-center">
            <button
              onClick={onNewTask}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Task
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
