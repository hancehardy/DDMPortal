import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';

const OrderSummary: React.FC = () => {
  const { orderData } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const calculateTotalItems = () => {
    return orderData.items.reduce((total, item) => total + item.qty, 0);
  };

  const calculateTotalSqFt = () => {
    return orderData.items.reduce((total, item) => {
      const itemSqFt = (item.width * item.height * item.qty) / 144; // Convert to square feet if in inches
      return total + (isNaN(itemSqFt) ? 0 : itemSqFt);
    }, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, you would send the order data to your backend here
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      // Reset form or redirect to confirmation page in a real app
    } catch (error) {
      setSubmitError('There was an error submitting your order. Please try again.');
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Customer</h3>
            <p className="text-gray-800">{orderData.company || 'Not specified'}</p>
            <p className="text-gray-800">{orderData.contact || 'Not specified'}</p>
            <p className="text-gray-800">{orderData.email || 'Not specified'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800">Order Details</h3>
            <p className="text-gray-800">Job: {orderData.jobName || 'Not specified'}</p>
            <p className="text-gray-800">PO#: {orderData.poNumber || 'Not specified'}</p>
            <p className="text-gray-800">Type: {orderData.quoteOrOrder}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800">Order Totals</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-800">Total Items: {calculateTotalItems()}</p>
              <p className="text-gray-800">Total Sq. Ft: {calculateTotalSqFt().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-800">Door Style: {orderData.doorStyle || 'Not specified'}</p>
              <p className="text-gray-800">Color: {orderData.color || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        {submitSuccess ? (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
            Your order has been submitted successfully! We will contact you shortly.
          </div>
        ) : (
          <div className="mt-6 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
            {submitError && (
              <div className="p-4 bg-red-100 text-red-800 rounded-md mb-4 w-full">
                {submitError}
              </div>
            )}
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary; 