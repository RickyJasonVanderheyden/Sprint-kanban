import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface TabNavProps {
  activeTab: 'focus' | 'kanban';
}

const TabNav: React.FC<TabNavProps> = ({ activeTab }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout API fails
      router.push('/login');
    }
  };

  return (
    <nav className="todo-nav fixed top-0 left-0 right-0 z-50 flex justify-between items-center border-b border-gray-200/50 px-6 py-4 shadow-lg">
      {/* Navigation Links */}
      <div className="flex space-x-2 relative z-10">
        <Link 
          href="/focus" 
          className={`px-5 py-2.5 font-medium transition-all duration-300 rounded-lg flex items-center ${
            activeTab === 'focus' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Focus Sprints
        </Link>
        <Link 
          href="/kanban" 
          className={`px-5 py-2.5 font-medium transition-all duration-300 rounded-lg flex items-center ${
            activeTab === 'kanban' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          Kanban Board
        </Link>
      </div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium flex items-center relative z-10"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </nav>
  );
};

export default TabNav; 