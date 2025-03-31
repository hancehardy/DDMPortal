'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Order } from '@/services/orderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import * as orderService from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        if (!isAuthenticated) {
          return;
        }
        
        // Get all orders using the service
        const allOrders = await orderService.getUserOrders();
        
        // Filter by user email if available
        let userOrders = allOrders;
        if (user && user.email) {
          userOrders = allOrders.filter(order => 
            order.customer && order.customer.email === user.email
          );
        }
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-800">Loading orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">My Orders</h1>
            <Link 
              href="/order" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Order
            </Link>
          </div>
          
          {orders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Job Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">
                          #{order.id?.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer?.company || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer?.jobName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'In Production' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {order.items.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          ${order.summary.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/orders/${order.id}`} className="text-blue-800 hover:text-blue-900 mr-3">
                            View
                          </Link>
                          <Link href={`/orders/${order.id}/duplicate`} className="text-blue-800 hover:text-blue-900 mr-3">
                            Duplicate
                          </Link>
                          {(order.status === 'Pending' || order.status === 'Draft') && (
                            <button 
                              onClick={async () => {
                                if (confirm('Are you sure you want to cancel this order?')) {
                                  try {
                                    await orderService.cancelOrder(order.id);
                                    // Refresh orders after cancellation
                                    const updatedOrders = await orderService.getUserOrders();
                                    setOrders(updatedOrders);
                                  } catch (error) {
                                    console.error('Error cancelling order:', error);
                                    alert('Failed to cancel order. Please try again.');
                                  }
                                }
                              }}
                              className="text-red-800 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-800 text-lg">You don't have any orders yet.</p>
              <Link 
                href="/order" 
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Place Your First Order
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 