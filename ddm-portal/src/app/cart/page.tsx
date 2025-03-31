'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { calculateItemPrice } from '@/utils/priceUtils';
import { Finish, GlassType } from '@/types';

interface CartItem {
  id: string;
  qty: number;
  width: number;
  height: number;
  doorStyle: string;
  manufacturer: string;
  color: string;
  glass: boolean;
  glassType: string;
  centerRail: boolean;
  bore?: boolean;
  hinge?: string;
  price: number;
  notes?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [glassTypes, setGlassTypes] = useState<GlassType[]>([]);

  useEffect(() => {
    // Load reference data (finishes and glass types) from localStorage
    const loadReferenceData = () => {
      try {
        const storedFinishes = localStorage.getItem('finishes');
        const storedGlassTypes = localStorage.getItem('glassTypes');
        
        if (storedFinishes) {
          setFinishes(JSON.parse(storedFinishes));
        }
        
        if (storedGlassTypes) {
          setGlassTypes(JSON.parse(storedGlassTypes));
        }
      } catch (error) {
        console.error('Error loading reference data:', error);
      }
    };

    loadReferenceData();
  }, []); // Empty dependency array since we only want to load reference data once

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        // Load cart items
        const storedCart = localStorage.getItem('cartItems');
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        
        // Calculate prices for each item
        const cartWithPrices = parsedCart.map(item => ({
          ...item,
          price: calculateItemPrice(
            item,
            finishes,
            glassTypes,
            item.color,
            item.manufacturer
          )
        }));
        
        setCartItems(cartWithPrices);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [finishes, glassTypes]);

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
    // Free shipping on orders over $139
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Shopping Cart</h1>
          <button
            onClick={() => {
              sessionStorage.setItem('fromCart', 'true');
              router.push('/order');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

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
                              <div className="text-sm text-gray-700">
                                Manufacturer: {item.manufacturer}
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
                              {item.bore && (
                                <div className="text-sm text-gray-700">
                                  With Bore Hole
                                </div>
                              )}
                              {item.hinge && item.hinge !== 'None' && (
                                <div className="text-sm text-gray-700">
                                  Hinge: {item.hinge}
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
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900 font-medium">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between border-b pb-2 text-green-700">
                      <span>Discount ({discount}%)</span>
                      <span>-${((getSubtotal() * discount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="text-blue-800 text-xl font-bold">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                {!promoApplied && (
                  <div className="mb-6">
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Try WELCOME10 for 10% off!</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={proceedToCheckout}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full px-4 py-2 text-gray-700 hover:text-red-600 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 