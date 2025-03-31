'use client';

import React, { useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { isValidItem, calculateItemPrice } from '@/utils/priceUtils';

const OrderItems: React.FC = () => {
  const { orderData, updateOrderItem, addOrderItem, removeOrderItem, glassTypes, finishes, isLoading } = useOrder();

  // Debug data
  useEffect(() => {
    console.log('OrderItems - Glass Types:', glassTypes);
    console.log('OrderItems - Selected Manufacturer:', orderData.manufacturer);
    console.log('OrderItems - Selected Color:', orderData.color);
  }, [glassTypes, orderData.manufacturer, orderData.color]);

  const handleChange = (id: string, field: string, value: string | number) => {
    updateOrderItem(id, { [field]: value });
  };

  const handleCheckboxChange = (id: string, field: string, checked: boolean) => {
    updateOrderItem(id, { [field]: checked });
  };

  // Use the shared pricing utility to calculate item price
  const getItemPrice = (item: any) => {
    console.log('OrderItems - Calculating price for item:', {
      item,
      manufacturer: orderData.manufacturer,
      color: orderData.color
    });
    
    return calculateItemPrice(
      item, 
      finishes, 
      glassTypes, 
      orderData.color,
      orderData.manufacturer
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Order Items</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Enter dimensions for each item. Items with zero dimensions will not be included in the order summary.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Width
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Height
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Glass Type
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Add
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData.items.map((item, index) => {
              const isValid = isValidItem(item);
              return (
                <tr key={item.id} className={!isValid && index !== orderData.items.length - 1 ? 'bg-red-50' : ''}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleChange(item.id, 'qty', parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.125"
                      value={item.width}
                      onChange={(e) => handleChange(item.id, 'width', parseFloat(e.target.value) || 0)}
                      className={`w-20 px-2 py-1 border ${item.width === 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Required"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.125"
                      value={item.height}
                      onChange={(e) => handleChange(item.id, 'height', parseFloat(e.target.value) || 0)}
                      className={`w-20 px-2 py-1 border ${item.height === 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Required"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={item.centerRail}
                          onChange={(e) => handleCheckboxChange(item.id, 'centerRail', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Center Rail</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={item.glass}
                          onChange={(e) => handleCheckboxChange(item.id, 'glass', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Glass</span>
                      </label>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={item.glassType}
                      onChange={(e) => handleChange(item.id, 'glassType', e.target.value)}
                      disabled={!item.glass}
                      className={`w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!item.glass ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
                      <option value="">Select Type</option>
                      {glassTypes.length > 0 ? (
                        glassTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name} (${type.sqftPrice.toFixed(2)}/sqft)
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No glass types available</option>
                      )}
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                      placeholder="Add notes"
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-gray-800">
                    ${getItemPrice(item).toFixed(2)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeOrderItem(item.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      disabled={orderData.items.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {index === orderData.items.length - 1 && (
                      <button
                        type="button"
                        onClick={addOrderItem}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        +
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItems; 