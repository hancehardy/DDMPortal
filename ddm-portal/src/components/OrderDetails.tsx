import React, { useMemo, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';

const OrderDetails: React.FC = () => {
  const { orderData, updateOrderData, doorStyles, finishes, manufacturers, isLoading } = useOrder();

  // Enhanced debug product data
  useEffect(() => {
    console.log('OrderDetails - Door Styles Data:', doorStyles);
    console.log('OrderDetails - Door Style Sample:', doorStyles.length > 0 ? doorStyles[0] : 'No door styles');
    console.log('OrderDetails - Manufacturers Data:', manufacturers);
    console.log('OrderDetails - Manufacturer Sample:', manufacturers.length > 0 ? manufacturers[0] : 'No manufacturers');
    console.log('OrderDetails - Finishes Data:', finishes);
    console.log('OrderDetails - Current Selected Manufacturer:', orderData.manufacturer);
    console.log('OrderDetails - Current Selected Color:', orderData.color);
    
    // Debug finishes filtered by selected manufacturer
    if (orderData.manufacturer) {
      const filteredByManufacturer = finishes.filter(f => f.manufacturer === orderData.manufacturer);
      console.log(`OrderDetails - Finishes for ${orderData.manufacturer}:`, filteredByManufacturer);
    }
    
    // Check if currently selected color exists in filtered finishes
    if (orderData.manufacturer && orderData.color) {
      const colorExists = finishes.some(
        f => f.manufacturer === orderData.manufacturer && f.name === orderData.color
      );
      console.log(`OrderDetails - Selected color ${orderData.color} exists for manufacturer ${orderData.manufacturer}:`, colorExists);
    }
  }, [doorStyles, manufacturers, finishes, orderData.manufacturer, orderData.color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If manufacturer changes, reset the color selection
    if (name === 'manufacturer' && value !== orderData.manufacturer) {
      console.log(`OrderDetails - Manufacturer changed from ${orderData.manufacturer} to ${value}, resetting color selection`);
      updateOrderData({ 
        [name]: value,
        color: '' // Reset color when manufacturer changes
      });
    } else {
      updateOrderData({ [name]: value });
    }
  };

  // Filter finishes based on selected manufacturer
  const filteredFinishes = useMemo(() => {
    if (!orderData.manufacturer) {
      return []; // No finishes if no manufacturer is selected
    }
    const result = finishes.filter(finish => finish.manufacturer === orderData.manufacturer);
    console.log(`OrderDetails - Filtered finishes for ${orderData.manufacturer}:`, result);
    return result;
  }, [finishes, orderData.manufacturer]);

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
              <option key={style.id} value={style.name}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer
          </label>
          <select
            id="manufacturer"
            name="manufacturer"
            value={orderData.manufacturer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
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
            disabled={!orderData.manufacturer} // Disable if no manufacturer selected
          >
            <option value="">
              {!orderData.manufacturer 
                ? "Select a manufacturer first" 
                : filteredFinishes.length === 0 
                  ? "No colors available for this manufacturer" 
                  : "Select Color"
              }
            </option>
            {filteredFinishes.map((finish) => (
              <option key={finish.id} value={finish.name}>
                {finish.name}
              </option>
            ))}
          </select>
          {orderData.manufacturer && filteredFinishes.length === 0 && (
            <p className="text-sm text-orange-500 mt-1">
              No colors found for this manufacturer. Please add colors in the admin panel.
            </p>
          )}
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