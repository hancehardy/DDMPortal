import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotalItems, calculateTotalSqFt, calculateTotalPrice, isValidItem } from '@/utils/priceUtils';
import AddToCartButton from './AddToCartButton';

const OrderSummary: React.FC = () => {
  const router = useRouter();
  const { orderData, finishes, glassTypes } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Filter out invalid items when displaying totals
  const validItems = orderData.items.filter(isValidItem);
  const hasValidItems = validItems.length > 0;

  // Use the shared utility functions for calculations
  const totalItems = calculateTotalItems(orderData.items);
  const totalSqFt = calculateTotalSqFt(orderData.items);
  const totalPrice = calculateTotalPrice(
    orderData.items, 
    finishes, 
    glassTypes, 
    orderData.color,
    orderData.manufacturer
  );

  const validateOrder = () => {
    // Basic validation
    if (!orderData.doorStyle) return "Please select a door style";
    if (!orderData.manufacturer) return "Please select a manufacturer";
    if (!orderData.color) return "Please select a color";
    if (!hasValidItems) return "Please add at least one valid item";
    
    // Check if any items have glass selected but no glass type
    const invalidGlassItems = orderData.items.filter(item => 
      item.glass && !item.glassType && isValidItem(item)
    );
    
    if (invalidGlassItems.length > 0) {
      return "One or more items have glass selected but no glass type";
    }
    
    return "";
  };

  const handleCreateOrder = async (isDraft: boolean) => {
    const error = validateOrder();
    if (error) {
      setSubmitError(error);
      setTimeout(() => setSubmitError(''), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare order data for submission
      const orderPayload = {
        ...orderData,
        status: isDraft ? 'Draft' : 'Pending',
        totalItems,
        totalSqFt,
        totalPrice,
        id: uuidv4() // Generate ID on client side
      };
      
      // Make API call to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      setSubmitSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setSubmitError(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Summary</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Order created successfully! Redirecting...</span>
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{submitError}</span>
        </div>
      )}
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500 mb-1">Total Items</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500 mb-1">Square Footage</p>
            <p className="text-2xl font-bold">{totalSqFt.toFixed(2)} sq ft</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-600 mb-1">Total Price</p>
            <p className="text-2xl font-bold text-blue-800">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={() => handleCreateOrder(true)}
          disabled={isSubmitting || !hasValidItems}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        
        <AddToCartButton 
          items={orderData.items} 
          orderDetails={{
            doorStyle: orderData.doorStyle,
            color: orderData.color,
            manufacturer: orderData.manufacturer
          }}
          disabled={isSubmitting || !hasValidItems}
        />
      </div>
    </div>
  );
};

export default OrderSummary; 