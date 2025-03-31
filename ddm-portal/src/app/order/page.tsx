'use client';

import React, { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import CustomerInfo from '@/components/CustomerInfo';
import OrderDetails from '@/components/OrderDetails';
import OrderItems from '@/components/OrderItems';
import OrderSummary from '@/components/OrderSummary';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function OrderPage() {
  const { isLoading, resetOrderData, resetOrderItems } = useOrder();
  const { isAuthenticated } = useAuth();
  const initialLoadRef = useRef(false);

  // Only reset order data when explicitly requested (e.g., starting a new order)
  useEffect(() => {
    if (!initialLoadRef.current) {
      // Check if we're coming from cart
      const isFromCart = sessionStorage.getItem('fromCart');
      if (isFromCart) {
        resetOrderItems(); // Reset only order items when returning from cart
      } else {
        resetOrderData(); // Reset everything for new orders
      }
      sessionStorage.removeItem('fromCart');
      initialLoadRef.current = true;
    }
  }, [resetOrderData, resetOrderItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order form...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">New Cabinet Door Order</h1>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Please fill out the form below to place your order for custom cabinet doors. 
            All fields marked with an asterisk (*) are required.
          </p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                You're checking out as a guest. Would you like to{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 underline">
                  create an account
                </Link>{' '}
                to save your information for future orders?
              </p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <CustomerInfo />
          <OrderDetails />
          <OrderItems />
          <OrderSummary />
        </form>
      </div>
    </Layout>
  );
} 