'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { v4 as uuidv4 } from 'uuid';
import * as orderService from '@/services/orderService';
import { Order } from '@/services/orderService';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get orderId from params
        const orderId = params.id as string;
        if (!orderId) {
          setError('Order ID not found');
          setLoading(false);
          return;
        }
        
        // Get order using the service
        const orderData = await orderService.getOrderById(orderId);
        
        if (!orderData) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
        setError('Error loading order details');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleReorder = async () => {
    if (!order) return;
    
    setIsReordering(true);
    
    try {
      // Use the service to add items to cart
      await orderService.addOrderItemsToCart(order);
      
      // Show success state
      setReorderSuccess(true);
      
      // Redirect to cart after a delay
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      alert('There was an error adding items to your cart. Please try again.');
    } finally {
      setIsReordering(false);
    }
  };
  
  const handleCancelOrder = async () => {
    if (!order) return;
    
    // Confirm cancellation
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    
    setIsCancelling(true);
    
    try {
      // Use the service to cancel the order
      await orderService.cancelOrder(order.id);
      
      // Show success state
      setCancelSuccess(true);
      
      // Update order status locally
      setOrder(prev => prev ? { ...prev, status: 'Cancelled' } : null);
      
      // Reset reorder button state
      setIsReordering(false);
      setReorderSuccess(false);
      
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('There was an error cancelling your order. Please try again or contact customer support.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'We could not find the order you are looking for.'}</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Order Details</h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
        
        {reorderSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700">Items have been added to your cart. Redirecting to cart...</p>
            </div>
          </div>
        )}
        
        {cancelSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700">Order has been successfully cancelled.</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Order Summary</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.doorStyle} Door</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500">
                            <p>{item.width}" × {item.height}"</p>
                            <p>Color: {item.color}</p>
                            {item.glass && <p>Glass: {item.glassType}</p>}
                            {item.centerRail && <p>Center Rail: Yes</p>}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {item.qty}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.summary.subtotal.toFixed(2)}</span>
                </div>
                
                {order.summary.discount > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Discount</span>
                    <span>-${order.summary.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.summary.shipping === 0 ? 'FREE' : `$${order.summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${order.summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                  <p className="text-gray-900">{order.customer.name}</p>
                  <p className="text-gray-900">{order.customer.email}</p>
                  <p className="text-gray-900">{order.customer.phone}</p>
                  {order.customer.company && <p className="text-gray-900">{order.customer.company}</p>}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                  <p className="text-gray-900">{order.customer.address}</p>
                  <p className="text-gray-900">
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                </div>
                
                {order.shippingNotes && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Notes</h3>
                    <p className="text-gray-900">{order.shippingNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Order Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                  <p className="text-gray-900">{formatDate(order.orderDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                  <p className="text-gray-900">
                    {order.paymentMethod === 'credit-card' ? 'Credit Card' : 'Invoice / Pay Later'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Status</h3>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Need Help?</h2>
              
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about your order, please contact our customer service team.
              </p>
              
              <a href="mailto:support@ddm-portal.com" className="text-blue-600 hover:underline block mb-2">
                support@ddm-portal.com
              </a>
              
              <p className="text-gray-600">
                Phone: (555) 123-4567
              </p>
              
              <p className="text-gray-600 mt-4">
                Business Hours: Mon-Fri, 9am-5pm EST
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              {order.status !== 'Cancelled' && (
                <button 
                  onClick={handleReorder}
                  disabled={isReordering || reorderSuccess}
                  className={`w-full px-4 py-3 ${
                    isReordering || reorderSuccess ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-semibold rounded-md transition-colors flex items-center justify-center`}
                >
                  {isReordering ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </>
                  ) : reorderSuccess ? (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Reorder Items
                    </>
                  )}
                </button>
              )}
              
              {order.status === 'Processing' && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={isCancelling || cancelSuccess}
                  className={`w-full px-4 py-3 ${
                    isCancelling ? 'bg-red-400' : cancelSuccess ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                  } text-white font-semibold rounded-md transition-colors flex items-center justify-center`}
                >
                  {isCancelling ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling Order...
                    </>
                  ) : cancelSuccess ? (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Order Cancelled
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Cancel Order
                    </>
                  )}
                </button>
              )}
              
              <div className="flex space-x-4">
                <Link 
                  href="/my-orders" 
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-center"
                >
                  Back to My Orders
                </Link>
                
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-center"
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 