'use client';

import React from 'react';
import Layout from '@/components/Layout';
import CustomerInfo from '@/components/CustomerInfo';
import OrderDetails from '@/components/OrderDetails';
import OrderItems from '@/components/OrderItems';
import OrderSummary from '@/components/OrderSummary';
import { useOrder } from '@/context/OrderContext';

export default function OrderPage() {
  const { isLoading } = useOrder();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-800">Loading order form...</p>
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
          <p className="text-gray-800">
            Please fill out the form below to place your order for custom cabinet doors. 
            All fields marked with an asterisk (*) are required.
          </p>
        </div>
        
        <form>
          <CustomerInfo />
          <OrderDetails />
          <OrderItems />
          <OrderSummary />
        </form>
      </div>
    </Layout>
  );
} 