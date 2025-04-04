'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem as OrderItemType } from '@/types';
import { calculateItemPrice } from '@/utils/priceUtils';

interface OrderItem {
  id: string;
  qty: number;
  width: number;
  height: number;
  centerRail: boolean;
  glass: boolean;
  glassType: string;
  notes: string;
  bore?: boolean;
  hinge?: string;
}

interface OrderDetails {
  doorStyle: string;
  color: string;
  manufacturer: string;
}

interface AddToCartButtonProps {
  items: OrderItem[];
  orderDetails: OrderDetails;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  items, 
  orderDetails,
  disabled = false
}) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    try {
      // Get valid items only (with dimensions)
      const validItems = items.filter(item => item.width > 0 && item.height > 0);
      
      if (validItems.length === 0) {
        alert('Please add at least one item with valid dimensions before adding to cart.');
        setIsAdding(false);
        return;
      }
      
      // Format items for cart
      const cartItems = validItems.map(item => ({
        id: uuidv4(),
        qty: item.qty,
        width: item.width,
        height: item.height,
        doorStyle: orderDetails.doorStyle,
        color: orderDetails.color,
        manufacturer: orderDetails.manufacturer,
        glass: item.glass,
        glassType: item.glass ? item.glassType : '',
        centerRail: item.centerRail,
        bore: item.bore || false,
        hinge: item.hinge || 'None',
        price: 0, // This will be calculated on the cart page based on current prices
        notes: item.notes
      }));
      
      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Add new items to cart
      const updatedCart = [...existingCart, ...cartItems];
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      // Show success state
      setAdded(true);
      
      // Automatically redirect to cart after a delay
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding items to your cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || added || disabled}
      className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
        added 
          ? 'bg-green-600 text-white' 
          : disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
      }`}
    >
      {isAdding ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding to Cart...
        </>
      ) : added ? (
        <>
          <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Added to Cart
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
};

export default AddToCartButton; 