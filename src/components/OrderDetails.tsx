import React from 'react';
import { useOrder } from '@/context/OrderContext';

const OrderDetails: React.FC = () => {
  const { orderData, updateOrderData, doorStyles, finishes, isLoading } = useOrder();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateOrderData({ [name]: value });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading order details...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Order Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="jobName" className="block text-sm font-medium text-gray-700 mb-1">
            Job Name
          </label>
          <input
            type="text"
            id="jobName"
            name="jobName"
            value={orderData.jobName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-1">
            PO Number
          </label>
          <input
            type="text"
            id="poNumber"
            name="poNumber"
            value={orderData.poNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="doorStyle" className="block text-sm font-medium text-gray-700 mb-1">
            Door Style
          </label>
          <select
            id="doorStyle"
            name="doorStyle"
            value={orderData.doorStyle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Door Style</option>
            {doorStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer
          </label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={orderData.manufacturer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <select
            id="color"
            name="color"
            value={orderData.color}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Color</option>
            {finishes.map((finish) => (
              <option key={finish.name} value={finish.name}>
                {finish.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="measurementUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Measurement Unit
          </label>
          <select
            id="measurementUnit"
            name="measurementUnit"
            value={orderData.measurementUnit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Inches">Inches</option>
            <option value="MM">MM</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="quoteOrOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Quote or Order
          </label>
          <select
            id="quoteOrOrder"
            name="quoteOrOrder"
            value={orderData.quoteOrOrder}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Quote">Quote</option>
            <option value="Order">Order</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 