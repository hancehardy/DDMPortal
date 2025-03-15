'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import CustomerInfo from '@/components/CustomerInfo';
import OrderDetails from '@/components/OrderDetails';
import OrderItems from '@/components/OrderItems';
import { useOrder } from '@/context/OrderContext';
import { OrderFormData } from '@/types';
import Link from 'next/link';

interface EditOrderClientProps {
  id: string;
}

const EditOrderClient: React.FC<EditOrderClientProps> = ({ id }) => {
  const router = useRouter();
  const { updateOrderData, orderData, isLoading } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // In a real app, this would fetch the order from an API
    const fetchOrder = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll use mock data
        // In a real app, you would fetch the order data from your backend
        const mockOrder: OrderFormData = {
          id: id,
          company: 'ABC Cabinets',
          contact: 'John Smith',
          address: '123 Main St, Anytown, USA',
          phone: '555-123-4567',
          email: 'john@abccabinets.com',
          jobName: 'Kitchen Renovation Project',
          doorStyle: 'Shaker',
          manufacturer: 'Premium Cabinets',
          color: 'White',
          measurementUnit: 'Inches',
          quoteOrOrder: 'Order',
          poNumber: 'PO-12345',
          orderDate: new Date().toISOString().split('T')[0],
          status: 'In Production',
          items: [
            {
              id: '1',
              qty: 4,
              width: 24,
              height: 30,
              centerRail: false,
              glass: false,
              glassType: '',
              notes: 'Upper cabinets'
            },
            {
              id: '2',
              qty: 6,
              width: 36,
              height: 30,
              centerRail: false,
              glass: false,
              glassType: '',
              notes: 'Lower cabinets'
            },
            {
              id: '3',
              qty: 2,
              width: 24,
              height: 30,
              centerRail: false,
              glass: true,
              glassType: 'Frosted',
              notes: 'Display cabinet'
            }
          ]
        };
        
        // Update the order context with the fetched data
        updateOrderData(mockOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order data. Please try again.');
      }
    };
    
    fetchOrder();
  }, [id, updateOrderData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, you would send the updated order data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      // Redirect to the order view page after successful update
      setTimeout(() => {
        router.push(`/orders/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Edit Order</h1>
          <Link 
            href={`/orders/${id}`}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Order updated successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <CustomerInfo />
          <OrderDetails />
          <OrderItems />
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Updating...
                </>
              ) : (
                'Update Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditOrderClient; 