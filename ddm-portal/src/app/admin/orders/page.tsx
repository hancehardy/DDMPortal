'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order, getUserOrders, updateOrder } from '@/services/orderService';
import Layout from '@/components/Layout';

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'On Hold'];

export default function AdminOrdersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Debug auth state
  useEffect(() => {
    console.log('Auth Debug - Order Management:');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, isAdmin]);
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/'); // Redirect non-admin users
    }
  }, [isAdmin, router]);
  
  // Load orders
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const allOrders = await getUserOrders();
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadOrders();
  }, []);
  
  // Handle filtering and sorting of orders
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.summary.total - a.summary.total);
        break;
      case 'lowest':
        result.sort((a, b) => a.summary.total - b.summary.total);
        break;
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortOrder]);
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      await updateOrder(orderId, { status: newStatus });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      // Show success message
      alert(`Order ${orderId.slice(0, 8).toUpperCase()} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };
  
  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Debug info:</p>
            <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
            <p>isAdmin: {isAdmin ? 'true' : 'false'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by ID, name, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Total</option>
              <option value="lowest">Lowest Total</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setSortOrder('newest');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Items</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div>{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ${order.summary.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                        ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${order.status === 'On Hold' ? 'bg-purple-100 text-purple-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <div className="relative">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateStatus(order.id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                            disabled={updating === order.id}
                            className="border rounded p-1 text-sm"
                          >
                            <option value="">Update Status</option>
                            {statusOptions.map(status => (
                              status !== order.status && (
                                <option key={status} value={status}>{status}</option>
                              )
                            ))}
                          </select>
                          {updating === order.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
} 