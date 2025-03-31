import React from 'react';
import { useOrder } from '@/context/OrderContext';

const OrderItems: React.FC = () => {
  const { orderData, updateOrderItem, addOrderItem, removeOrderItem, glassTypes, isLoading } = useOrder();

  const handleChange = (id: string, field: string, value: any) => {
    updateOrderItem(id, { [field]: value });
  };

  const handleCheckboxChange = (id: string, field: string, checked: boolean) => {
    updateOrderItem(id, { [field]: checked });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading order items...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Order Items</h2>
        <button
          type="button"
          onClick={addOrderItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Width
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Height
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Hinge
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Bore
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Center Rail
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Glass
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Glass Type
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Notes
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData.items.map((item) => (
              <tr key={item.id}>
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
                    step="0.125"
                    value={item.width}
                    onChange={(e) => handleChange(item.id, 'width', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    step="0.125"
                    value={item.height}
                    onChange={(e) => handleChange(item.id, 'height', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <select
                    value={item.hinge}
                    onChange={(e) => handleChange(item.id, 'hinge', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="None">None</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={item.bore}
                        onChange={(e) => handleCheckboxChange(item.id, 'bore', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-800">Bore</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={item.centerRail}
                        onChange={(e) => handleCheckboxChange(item.id, 'centerRail', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-800">Center Rail</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={item.glass}
                        onChange={(e) => handleCheckboxChange(item.id, 'glass', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-800">Glass</span>
                    </label>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <select
                    value={item.glassType}
                    onChange={(e) => handleChange(item.id, 'glassType', e.target.value)}
                    disabled={!item.glass}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Select Glass</option>
                    {glassTypes.map((glass) => (
                      <option key={glass.name} value={glass.name}>
                        {glass.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notes"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => removeOrderItem(item.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orderData.items.length === 0 && (
        <div className="text-center py-4 text-gray-700">
          No items added yet. Click "Add Item" to start your order.
        </div>
      )}
    </div>
  );
};

export default OrderItems; 