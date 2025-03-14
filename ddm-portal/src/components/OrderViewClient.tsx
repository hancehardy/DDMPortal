'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderFormData } from '@/types';
import Layout from '@/components/Layout';

interface OrderViewClientProps {
  id: string;
}

const OrderViewClient: React.FC<OrderViewClientProps> = ({ id }) => {
  const router = useRouter();
  const [order, setOrder] = useState<OrderFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate by getting from localStorage or using mock data
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Try to get from localStorage
        const savedOrders = localStorage.getItem('savedOrders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          const foundOrder = orders.find((o: any) => o.id === id);
          if (foundOrder) {
            setOrder(foundOrder);
            return;
          }
        }

        // If not found in localStorage, use mock data
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        setOrder({
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
              bore: true,
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
              bore: true,
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
              bore: false,
              centerRail: false,
              glass: true,
              glassType: 'Frosted',
              notes: 'Display cabinet'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              The order you are looking for does not exist or has been removed.
            </p>
            <Link 
              href="/orders" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);
  
  // Calculate total square footage
  const totalSqFt = order.items.reduce((sum, item) => {
    const itemSqFt = (item.width * item.height * item.qty) / 144; // Convert to square feet
    return sum + itemSqFt;
  }, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Order Details</h1>
          <div className="flex space-x-4">
            <Link 
              href="/orders" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Orders
            </Link>
            <Link 
              href={`/orders/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Order
            </Link>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-blue-800">Order #{id.substring(0, 8)}</h2>
              <p className="text-gray-600">Placed on: {order.orderDate || 'N/A'}</p>
            </div>
            <div>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                  order.status === 'In Production' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {order.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-gray-800">{order.company || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Name</p>
              <p className="text-gray-800">{order.contact || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-gray-800">{order.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-800">{order.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-800">{order.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Job Name</p>
              <p className="text-gray-800">{order.jobName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">PO Number</p>
              <p className="text-gray-800">{order.poNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Door Style</p>
              <p className="text-gray-800">{order.doorStyle || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Manufacturer</p>
              <p className="text-gray-800">{order.manufacturer || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Color</p>
              <p className="text-gray-800">{order.color || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Measurement Unit</p>
              <p className="text-gray-800">{order.measurementUnit || 'Inches'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quote or Order</p>
              <p className="text-gray-800">{order.quoteOrOrder || 'Quote'}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Width
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Height
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Glass Type
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                      {item.qty}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                      {item.width} {order.measurementUnit}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                      {item.height} {order.measurementUnit}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <ul className="text-gray-800">
                        {item.bore && <li>Bore</li>}
                        {item.centerRail && <li>Center Rail</li>}
                        {item.glass && <li>Glass</li>}
                      </ul>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                      {item.glass ? (item.glassType || 'Standard') : 'N/A'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                      {item.notes || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-xl font-semibold text-gray-800">{totalItems}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Square Footage</p>
              <p className="text-xl font-semibold text-gray-800">{totalSqFt.toFixed(2)} sq ft</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mb-8">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Print Order
          </button>
          <Link 
            href={`/orders/${id}/duplicate`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Duplicate Order
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderViewClient; 