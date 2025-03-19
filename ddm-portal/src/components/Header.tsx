'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  // Debug auth state
  useEffect(() => {
    console.log('Auth Debug - Header:');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
    console.log('Is Authenticated:', isAuthenticated);
  }, [user, isAdmin, isAuthenticated]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        // Calculate total quantity of all items in cart
        const count = cartItems.reduce((total: number, item: any) => total + item.qty, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Error reading cart items:', error);
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // For changes within the same tab
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            DDM Cabinet Door Portal
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
            </li>
            
            <li>
              <Link href="/order" className="hover:text-blue-200 transition-colors">
                Create Order
              </Link>
            </li>
            
            {/* Admin dropdown only shows if user is an admin */}
            {isAuthenticated && isAdmin && (
              <li className="relative" ref={adminDropdownRef}>
                <button 
                  className="hover:text-blue-200 transition-colors flex items-center"
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  aria-expanded={adminDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="mr-1">Admin</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {adminDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/admin/orders"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Order Management
                    </Link>
                    <Link
                      href="/admin/products"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Product Management
                    </Link>
                    <Link
                      href="/admin/users"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      User Management
                    </Link>
                  </div>
                )}
              </li>
            )}
            
            {/* Cart Icon */}
            <li>
              <Link 
                href="/cart" 
                className="hover:text-blue-200 transition-colors relative"
                aria-label="View cart"
              >
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            
            {isAuthenticated ? (
              <li className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center hover:text-blue-200 transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="mr-1">{user?.name}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                      {isAdmin && (
                        <div className="mt-1 inline-flex px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Admin
                        </div>
                      )}
                    </div>
                    <Link
                      href="/my-orders"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/orders"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Order Management
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
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