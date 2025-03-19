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

  const getFinishPrice = () => {
    const selectedFinish = finishes.find(finish => finish.name === orderData.color);
    return selectedFinish?.sqftPrice || 0;
  };

  const calculateItemPrice = (item: any) => {
    const itemSqFt = (item.width * item.height * item.qty) / 144;
    if (isNaN(itemSqFt) || itemSqFt <= 0) return 0;

    const finishPrice = getFinishPrice();
    let totalPricePerSqFt = finishPrice;

    // Add glass price if glass is selected
    if (item.glass && item.glassType) {
      const selectedGlassType = glassTypes.find(glass => glass.name === item.glassType);
      const glassPrice = selectedGlassType?.sqftPrice || 0;
      totalPricePerSqFt += glassPrice;
    }

    return itemSqFt * totalPricePerSqFt;
  };

  const handleSubmit = async () => {
    if (!hasValidItems) {
      setSubmitError('Please add at least one item with dimensions before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, you would send the order data to your backend here
      // For now, we'll just save to localStorage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for the order
      const orderId = uuidv4();
      
      // Calculate totals
      const totalItems = calculateTotalItems(orderData.items);
      const totalSqFt = calculateTotalSqFt(orderData.items);
      const totalPrice = calculateTotalPrice(orderData.items, finishes, glassTypes, orderData.color);
      
      // Add additional order metadata
      const completeOrder = {
        ...orderData,
        // Only include valid items
        items: validItems,
        id: orderId,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        totalItems,
        totalSqFt,
        totalPrice
      };
      
      // Save to localStorage
      const savedOrders = localStorage.getItem('savedOrders');
      let orders = [];
      
      if (savedOrders) {
        orders = JSON.parse(savedOrders);
      }
      
      orders.push(completeOrder);
      localStorage.setItem('savedOrders', JSON.stringify(orders));
      
      setSubmitSuccess(true);
      
      // After a short delay, redirect to the order view page
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 2000);
    } catch (error) {
      setSubmitError('There was an error submitting your order. Please try again.');
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      // Generate a unique ID for the draft
      const draftId = uuidv4();
      
      // Calculate totals
      const totalItems = calculateTotalItems(orderData.items);
      const totalSqFt = calculateTotalSqFt(orderData.items);
      const totalPrice = calculateTotalPrice(orderData.items, finishes, glassTypes, orderData.color);
      
      // Add additional order metadata
      const draftOrder = {
        ...orderData,
        id: draftId,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        totalItems,
        totalSqFt,
        totalPrice
      };
      
      // Save to localStorage
      const savedDrafts = localStorage.getItem('savedDrafts');
      let drafts = [];
      
      if (savedDrafts) {
        drafts = JSON.parse(savedDrafts);
      }
      
      drafts.push(draftOrder);
      localStorage.setItem('savedDrafts', JSON.stringify(drafts));
      
      // Show success message
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('There was an error saving your draft. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">Customer</h3>
            <p className="text-gray-600">{orderData.company || 'Not specified'}</p>
            <p className="text-gray-600">{orderData.contact || 'Not specified'}</p>
            <p className="text-gray-600">{orderData.email || 'Not specified'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700">Order Details</h3>
            <p className="text-gray-600">Job: {orderData.jobName || 'Not specified'}</p>
            <p className="text-gray-600">PO#: {orderData.poNumber || 'Not specified'}</p>
            <p className="text-gray-600">Type: {orderData.quoteOrOrder}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700">Order Totals</h3>
          {!hasValidItems ? (
            <p className="text-amber-600 mt-2">No valid items added. Please add items with dimensions to your order.</p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Total Items: {calculateTotalItems(orderData.items)}</p>
                <p className="text-gray-600">Total Sq. Ft: {calculateTotalSqFt(orderData.items).toFixed(2)}</p>
                <p className="text-gray-600">Total Price: ${calculateTotalPrice(orderData.items, finishes, glassTypes, orderData.color).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Door Style: {orderData.doorStyle || 'Not specified'}</p>
                <p className="text-gray-600">Color: {orderData.color || 'Not specified'}</p>
                <p className="text-gray-600">Finish Price: ${getFinishPrice().toFixed(2)}/sq.ft</p>
              </div>
            </div>
          )}
        </div>
        
        {submitSuccess ? (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
            Your order has been submitted successfully! Redirecting to order details...
          </div>
        ) : (
          <div className="mt-6 flex flex-col space-y-3">
            {submitError && (
              <div className="p-4 bg-red-100 text-red-800 rounded-md w-full">
                {submitError}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasValidItems}
                  className={`px-6 py-2 ${!hasValidItems ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
              
              <AddToCartButton 
                items={orderData.items}
                doorStyle={orderData.doorStyle}
                color={orderData.color}
                calculateItemPrice={calculateItemPrice}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary; 