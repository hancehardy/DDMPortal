'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';

interface CartItem {
  id: string;
  qty: number;
  width: number;
  height: number;
  doorStyle: string;
  color: string;
  glass: boolean;
  glassType: string;
  centerRail: boolean;
  price: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Load cart items from localStorage
    const loadCart = () => {
      setLoading(true);
      try {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const applyPromoCode = () => {
    // Simple promo code implementation
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      setPromoApplied(true);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    // Free shipping on orders over $139 (like Cabinet Door Store)
    return subtotal > 139 ? 0 : 15.99;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShipping();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping - discountAmount;
  };

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading your cart...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-8">
            <p className="text-gray-700 text-lg mb-6">Your cart is currently empty.</p>
            <Link 
              href="/order" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.doorStyle} Door
                              </div>
                              <div className="text-sm text-gray-700">
                                {item.width}" × {item.height}" - {item.color}
                              </div>
                              {item.glass && (
                                <div className="text-sm text-gray-700">
                                  Glass: {item.glassType}
                                </div>
                              )}
                              {item.centerRail && (
                                <div className="text-sm text-gray-700">
                                  With Center Rail
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border rounded-md w-24">
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                              className="px-2 py-1 text-gray-700 hover:text-gray-900"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-10 text-center border-0 focus:ring-0"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="px-2 py-1 text-gray-700 hover:text-gray-900"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 bg-gray-50 flex justify-between">
                  <div className="flex">
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Clear Cart
                    </button>
                    <Link
                      href="/order"
                      className="ml-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Update Cart
                  </button>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Have a coupon?</h2>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code"
                    className="px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                    disabled={promoApplied}
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    className={`px-4 py-2 rounded-r-md ${
                      promoApplied 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-sm text-green-600">Coupon code applied successfully!</p>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900 font-medium">${getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Discount ({discount}%)</span>
                      <span className="text-green-600 font-medium">-${((getSubtotal() * discount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-700">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={proceedToCheckout}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              {/* FAQ */}
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">How long will my order take?</h3>
                    <p className="text-sm text-gray-700 mt-1">Most orders ship within 7-10 business days. Custom orders may take longer.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Can I modify my order?</h3>
                    <p className="text-sm text-gray-700 mt-1">Orders can be modified within 24 hours of placing them. Please contact customer service.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Do you offer discounts?</h3>
                    <p className="text-sm text-gray-700 mt-1">We offer free shipping on orders over $139. Sign up for our newsletter to receive special discount codes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 