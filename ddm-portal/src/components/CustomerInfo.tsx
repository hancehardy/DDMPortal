import React, { useEffect, useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';

const CustomerInfo: React.FC = () => {
  const { orderData, updateOrderData } = useOrder();
  const { user, isAuthenticated } = useAuth();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.customerInfo && !hasInitialized) {
      // Update order data with user information only once
      const userInfo = {
        company: user.customerInfo.company || '',
        contact: user.name || '',
        address: user.customerInfo.address || '',
        phone: user.customerInfo.phone || '',
        email: user.email || '',
      };
      
      // Only update if the data needs to be changed
      const needsUpdate = 
        userInfo.company !== orderData.company ||
        userInfo.contact !== orderData.contact ||
        userInfo.address !== orderData.address ||
        userInfo.phone !== orderData.phone ||
        userInfo.email !== orderData.email;
        
      if (needsUpdate) {
        updateOrderData(userInfo);
      }
      
      // Check if customer info is complete
      const isInfoComplete = 
        user.customerInfo.company && 
        user.name && 
        user.customerInfo.address && 
        user.customerInfo.phone && 
        user.email;

      if (isInfoComplete) {
        setShowForm(false);
      }
      
      setHasInitialized(true);
    }
  }, [isAuthenticated, user, updateOrderData, orderData, hasInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateOrderData({ [name]: value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Customer Information</h2>
        {!showForm && (
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Edit
          </button>
        )}
      </div>
      
      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Company:</p>
            <p className="text-gray-900">{orderData.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Contact Name:</p>
            <p className="text-gray-900">{orderData.contact}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700">Address:</p>
            <p className="text-gray-900">{orderData.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Phone:</p>
            <p className="text-gray-900">{orderData.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="text-gray-900">{orderData.email}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={orderData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={orderData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={orderData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={orderData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={orderData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {isAuthenticated && !fieldsDisabled && (
            <div className="md:col-span-2 mt-2">
              <button
                type="button"
                onClick={() => setFieldsDisabled(true)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Use this information for future orders
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerInfo; 