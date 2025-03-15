'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { DoorStyle, Finish, GlassType, Manufacturer } from '@/types';
import { useOrder } from '@/context/OrderContext';

export default function AdminPage() {
  const { 
    doorStyles, 
    finishes, 
    glassTypes, 
    manufacturers,
    addDoorStyle, 
    addFinish, 
    addGlassType,
    addManufacturer,
    updateDoorStyle,
    updateFinish,
    updateGlassType,
    updateManufacturer,
    deleteDoorStyle,
    deleteFinish,
    deleteGlassType,
    deleteManufacturer
  } = useOrder();
  
  const [newDoorStyle, setNewDoorStyle] = useState<Partial<DoorStyle>>({
    name: '',
    available: true
  });
  
  const [newFinish, setNewFinish] = useState<Partial<Finish>>({
    name: '',
    manufacturer: ''
  });
  
  const [newGlassType, setNewGlassType] = useState<Partial<GlassType>>({
    name: '',
    sqftPrice: 0,
    sqftMinimum: 1
  });

  const [newManufacturer, setNewManufacturer] = useState<Partial<Manufacturer>>({
    name: ''
  });

  const [activeTab, setActiveTab] = useState<'doorStyles' | 'finishes' | 'glassTypes' | 'manufacturers'>('doorStyles');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddDoorStyle = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newDoorStyle.name) {
        if (editingIndex !== null) {
          updateDoorStyle(editingIndex, {
            name: newDoorStyle.name,
            available: newDoorStyle.available ?? true
          });
          setSuccessMessage(`Door style "${newDoorStyle.name}" updated successfully!`);
        } else {
          addDoorStyle({
            name: newDoorStyle.name,
            available: newDoorStyle.available ?? true
          });
          setSuccessMessage(`Door style "${newDoorStyle.name}" added successfully!`);
        }
        setNewDoorStyle({ name: '', available: true });
        setEditingIndex(null);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Please fill in all required fields');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error handling door style:', error);
      setErrorMessage(`Error handling door style: ${error instanceof Error ? error.message : String(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAddFinish = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newFinish.name && newFinish.manufacturer) {
        if (editingIndex !== null) {
          updateFinish(editingIndex, {
            name: newFinish.name,
            manufacturer: newFinish.manufacturer
          });
          setSuccessMessage(`Finish "${newFinish.name}" updated successfully!`);
        } else {
          addFinish({
            name: newFinish.name,
            manufacturer: newFinish.manufacturer
          });
          setSuccessMessage(`Finish "${newFinish.name}" added successfully!`);
        }
        setNewFinish({ name: '', manufacturer: '' });
        setEditingIndex(null);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error handling finish:', error);
      setErrorMessage(`Error handling finish: ${error instanceof Error ? error.message : String(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAddGlassType = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newGlassType.name && newGlassType.sqftPrice !== undefined && newGlassType.sqftMinimum !== undefined) {
        if (editingIndex !== null) {
          updateGlassType(editingIndex, {
            name: newGlassType.name,
            sqftPrice: newGlassType.sqftPrice,
            sqftMinimum: newGlassType.sqftMinimum
          });
          setSuccessMessage(`Glass type "${newGlassType.name}" updated successfully!`);
        } else {
          addGlassType({
            name: newGlassType.name,
            sqftPrice: newGlassType.sqftPrice,
            sqftMinimum: newGlassType.sqftMinimum
          });
          setSuccessMessage(`Glass type "${newGlassType.name}" added successfully!`);
        }
        setNewGlassType({ name: '', sqftPrice: 0, sqftMinimum: 1 });
        setEditingIndex(null);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error handling glass type:', error);
      setErrorMessage(`Error handling glass type: ${error instanceof Error ? error.message : String(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAddManufacturer = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newManufacturer.name) {
        if (editingIndex !== null) {
          updateManufacturer(editingIndex, {
            name: newManufacturer.name
          });
          setSuccessMessage(`Manufacturer "${newManufacturer.name}" updated successfully!`);
        } else {
          addManufacturer({
            name: newManufacturer.name
          });
          setSuccessMessage(`Manufacturer "${newManufacturer.name}" added successfully!`);
        }
        setNewManufacturer({ name: '' });
        setEditingIndex(null);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Please enter a manufacturer name');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error handling manufacturer:', error);
      setErrorMessage(`Error handling manufacturer: ${error instanceof Error ? error.message : String(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleEdit = (index: number, type: 'doorStyles' | 'finishes' | 'glassTypes' | 'manufacturers') => {
    setEditingIndex(index);
    switch (type) {
      case 'doorStyles':
        setNewDoorStyle(doorStyles[index]);
        break;
      case 'finishes':
        setNewFinish(finishes[index]);
        break;
      case 'glassTypes':
        setNewGlassType(glassTypes[index]);
        break;
      case 'manufacturers':
        setNewManufacturer(manufacturers[index]);
        break;
    }
  };

  const handleDelete = (index: number, type: 'doorStyles' | 'finishes' | 'glassTypes' | 'manufacturers') => {
    try {
      switch (type) {
        case 'doorStyles':
          deleteDoorStyle(index);
          setSuccessMessage(`Door style deleted successfully!`);
          break;
        case 'finishes':
          deleteFinish(index);
          setSuccessMessage(`Finish deleted successfully!`);
          break;
        case 'glassTypes':
          deleteGlassType(index);
          setSuccessMessage(`Glass type deleted successfully!`);
          break;
        case 'manufacturers':
          deleteManufacturer(index);
          setSuccessMessage(`Manufacturer deleted successfully!`);
          break;
      }
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      setErrorMessage(`Error deleting item: ${error instanceof Error ? error.message : String(error)}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewDoorStyle({ name: '', available: true });
    setNewFinish({ name: '', manufacturer: '' });
    setNewGlassType({ name: '', sqftPrice: 0, sqftMinimum: 1 });
    setNewManufacturer({ name: '' });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('doorStyles');
                  handleCancelEdit();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'doorStyles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Door Styles
              </button>
              <button
                onClick={() => {
                  setActiveTab('finishes');
                  handleCancelEdit();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'finishes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Finishes
              </button>
              <button
                onClick={() => {
                  setActiveTab('glassTypes');
                  handleCancelEdit();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'glassTypes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Glass Types
              </button>
              <button
                onClick={() => {
                  setActiveTab('manufacturers');
                  handleCancelEdit();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manufacturers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manufacturers
              </button>
            </nav>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {activeTab === 'doorStyles' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {editingIndex !== null ? 'Edit Door Style' : 'Add New Door Style'}
              </h2>
              <form onSubmit={handleAddDoorStyle} className="space-y-4">
                <div>
                  <label htmlFor="doorStyleName" className="block text-sm font-medium text-gray-700">
                    Door Style Name*
                  </label>
                  <input
                    type="text"
                    id="doorStyleName"
                    value={newDoorStyle.name}
                    onChange={(e) => setNewDoorStyle({...newDoorStyle, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="doorStyleAvailable"
                    checked={newDoorStyle.available}
                    onChange={(e) => setNewDoorStyle({...newDoorStyle, available: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="doorStyleAvailable" className="ml-2 block text-sm text-gray-700">
                    Available
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'} Door Style
                  </button>
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Current Door Styles</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {doorStyles.map((style, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="text-gray-900">{style.name}</span>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            style.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {style.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index, 'doorStyles')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, 'doorStyles')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finishes' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {editingIndex !== null ? 'Edit Finish' : 'Add New Finish'}
              </h2>
              <form onSubmit={handleAddFinish} className="space-y-4">
                <div>
                  <label htmlFor="finishName" className="block text-sm font-medium text-gray-700">
                    Color/Finish Name*
                  </label>
                  <input
                    type="text"
                    id="finishName"
                    value={newFinish.name}
                    onChange={(e) => setNewFinish({...newFinish, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                    Manufacturer*
                  </label>
                  <select
                    id="manufacturer"
                    value={newFinish.manufacturer}
                    onChange={(e) => setNewFinish({...newFinish, manufacturer: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a manufacturer</option>
                    {manufacturers.map((manufacturer, index) => (
                      <option key={index} value={manufacturer.name}>
                        {manufacturer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'} Finish
                  </button>
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Current Finishes</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {finishes.map((finish, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="text-gray-900">{finish.name}</span>
                          <span className="ml-2 text-gray-500">{finish.manufacturer}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index, 'finishes')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, 'finishes')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'glassTypes' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {editingIndex !== null ? 'Edit Glass Type' : 'Add New Glass Type'}
              </h2>
              <form onSubmit={handleAddGlassType} className="space-y-4">
                <div>
                  <label htmlFor="glassTypeName" className="block text-sm font-medium text-gray-700">
                    Glass Type Name*
                  </label>
                  <input
                    type="text"
                    id="glassTypeName"
                    value={newGlassType.name}
                    onChange={(e) => setNewGlassType({...newGlassType, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sqftPrice" className="block text-sm font-medium text-gray-700">
                    Price per Square Foot*
                  </label>
                  <input
                    type="number"
                    id="sqftPrice"
                    value={newGlassType.sqftPrice}
                    onChange={(e) => setNewGlassType({...newGlassType, sqftPrice: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sqftMinimum" className="block text-sm font-medium text-gray-700">
                    Minimum Square Feet*
                  </label>
                  <input
                    type="number"
                    id="sqftMinimum"
                    value={newGlassType.sqftMinimum}
                    onChange={(e) => setNewGlassType({...newGlassType, sqftMinimum: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'} Glass Type
                  </button>
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Current Glass Types</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {glassTypes.map((glass, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="text-gray-900">{glass.name}</span>
                          <span className="ml-2 text-gray-500">
                            ${glass.sqftPrice.toFixed(2)}/sqft (Min: {glass.sqftMinimum} sqft)
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index, 'glassTypes')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, 'glassTypes')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manufacturers' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {editingIndex !== null ? 'Edit Manufacturer' : 'Add New Manufacturer'}
              </h2>
              <form onSubmit={handleAddManufacturer} className="space-y-4">
                <div>
                  <label htmlFor="manufacturerName" className="block text-sm font-medium text-gray-700">
                    Manufacturer Name*
                  </label>
                  <input
                    type="text"
                    id="manufacturerName"
                    value={newManufacturer.name}
                    onChange={(e) => setNewManufacturer({...newManufacturer, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'} Manufacturer
                  </button>
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Current Manufacturers</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {manufacturers.map((manufacturer, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="text-gray-900">{manufacturer.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index, 'manufacturers')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, 'manufacturers')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 