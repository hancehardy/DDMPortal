'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">DDM Cabinet Door Portal</h1>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
            </li>
            
            {isAuthenticated && (
              <>
                <li>
                  <Link href="/order" className="hover:text-blue-200 transition-colors">
                    New Order
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-blue-200 transition-colors">
                    My Orders
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className="hover:text-blue-200 transition-colors">
                      Admin
                    </Link>
                  </li>
                )}
              </>
            )}
            
            {isAuthenticated ? (
              <li className="relative group">
                <button className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-1">{user?.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-white text-blue-800 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 