'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

interface Product {
  id: string;
  name: string;
  type: 'doorStyle' | 'finish' | 'glassType' | 'manufacturer';
  active: boolean;
  description?: string;
  imageUrl?: string;
  manufacturer?: string;
  sqftPrice?: number;
}

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [manufacturers, setManufacturers] = useState<{id: string, name: string}[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    type: 'doorStyle',
    active: true,
    description: '',
    imageUrl: '',
    manufacturer: '',
    sqftPrice: 0
  });

  // Debug auth state
  useEffect(() => {
    console.log('Auth Debug - Product Management:');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, isAdmin]);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/'); // Redirect non-admin users
    }
  }, [isAdmin, router]);
  
  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        
        // Fetch all product types from APIs
        const doorStyles = await fetch('/api/door-styles').then(res => res.json());
        const finishes = await fetch('/api/finishes').then(res => res.json());
        const glassTypes = await fetch('/api/glass-types').then(res => res.json());
        const manufacturersData = await fetch('/api/manufacturers').then(res => res.json());
        
        // Store manufacturers for dropdown lists
        setManufacturers(manufacturersData.map((item: any) => ({
          id: item.id,
          name: item.name
        })));
        
        // Map each to Product type with appropriate type field
        const formattedDoorStyles = doorStyles.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'doorStyle',
          active: item.available, // Map available to active
          description: '', // DoorStyle model doesn't have description
          imageUrl: '', // DoorStyle model doesn't have imageUrl
          manufacturer: '',
          sqftPrice: 0
        }));
        
        const formattedFinishes = finishes.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'finish',
          active: true, // Finish model doesn't have active status
          description: `Price: $${item.sqftPrice.toFixed(2)}/sqft, Manufacturer: ${item.manufacturer}`,
          imageUrl: '',
          manufacturer: item.manufacturer,
          sqftPrice: item.sqftPrice
        }));
        
        const formattedGlassTypes = glassTypes.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'glassType',
          active: true, // GlassType model doesn't have active status
          description: `Price: $${item.sqftPrice}/sqft, Minimum: ${item.sqftMinimum} sqft`,
          imageUrl: '',
          manufacturer: '',
          sqftPrice: item.sqftPrice
        }));
        
        const formattedManufacturers = manufacturersData.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'manufacturer',
          active: true, // Manufacturer model doesn't have active status
          description: '',
          imageUrl: '',
          manufacturer: '',
          sqftPrice: 0
        }));
        
        // Combine all products
        const allProducts = [
          ...formattedDoorStyles,
          ...formattedFinishes,
          ...formattedGlassTypes,
          ...formattedManufacturers
        ];
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);
  
  // Filter products based on search and type
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (productType) {
      result = result.filter(product => product.type === productType);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, productType]);
  
  const handleToggleActive = async (id: string) => {
    // Find the product to toggle
    const productToToggle = products.find(product => product.id === id);
    if (!productToToggle) return;
    
    // Create updated version for UI
    const updatedProduct = { 
      ...productToToggle, 
      active: !productToToggle.active 
    };
    
    try {
      // Determine API endpoint based on product type
      let endpoint = '';
      let requestData = {};
      
      switch(productToToggle.type) {
        case 'doorStyle':
          endpoint = `/api/door-styles/${id}`;
          requestData = {
            name: productToToggle.name,
            available: !productToToggle.active // Toggle available property
          };
          break;
        case 'finish':
          endpoint = `/api/finishes/${id}`;
          // Note: The finish model doesn't have an active/available field
          // You may need to adjust your database schema
          alert('Toggling active status for finishes is not supported in the current database schema');
          return;
        case 'glassType':
          endpoint = `/api/glass-types/${id}`;
          // Note: The glassType model doesn't have an active/available field
          // You may need to adjust your database schema
          alert('Toggling active status for glass types is not supported in the current database schema');
          return;
        case 'manufacturer':
          endpoint = `/api/manufacturers/${id}`;
          // Note: The manufacturer model doesn't have an active/available field
          // You may need to adjust your database schema
          alert('Toggling active status for manufacturers is not supported in the current database schema');
          return;
      }
      
      // Make API call
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      // Update local state only after successful API call
      const updatedProducts = products.map(product => {
        if (product.id === id) {
          return updatedProduct;
        }
        return product;
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product status');
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };
  
  const handleSaveEdit = async () => {
    try {
      if (!editingProduct) return;
      
      // Determine API endpoint based on product type
      let endpoint = '';
      let requestData = {};
      
      switch(editingProduct.type) {
        case 'doorStyle':
          endpoint = `/api/door-styles/${editingProduct.id}`;
          requestData = { 
            name: editingProduct.name,
            available: editingProduct.active
          };
          break;
        case 'finish':
          endpoint = `/api/finishes/${editingProduct.id}`;
          requestData = { 
            name: editingProduct.name,
            manufacturer: editingProduct.manufacturer || manufacturers[0]?.name || '',
            sqftPrice: editingProduct.sqftPrice || 0
          };
          break;
        case 'glassType':
          endpoint = `/api/glass-types/${editingProduct.id}`;
          requestData = { 
            name: editingProduct.name,
            sqftPrice: 0, // You might need to add this to your form
            sqftMinimum: 0 // You might need to add this to your form
          };
          break;
        case 'manufacturer':
          endpoint = `/api/manufacturers/${editingProduct.id}`;
          requestData = { 
            name: editingProduct.name
          };
          break;
      }
      
      // Make API call
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      // Update local state only after successful API call
      const updatedProducts = products.map(product => {
        if (product.id === editingProduct.id) {
          return editingProduct;
        }
        return product;
      });
      
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };
  
  const handleAddProduct = async () => {
    try {
      // Determine API endpoint based on product type
      let endpoint = '';
      let requestData = {};
      
      switch(newProduct.type) {
        case 'doorStyle':
          endpoint = '/api/door-styles';
          requestData = { 
            name: newProduct.name,
            available: newProduct.active
          };
          break;
        case 'finish':
          endpoint = '/api/finishes';
          requestData = { 
            name: newProduct.name,
            manufacturer: newProduct.manufacturer || manufacturers[0]?.name || '',
            sqftPrice: newProduct.sqftPrice || 0
          };
          break;
        case 'glassType':
          endpoint = '/api/glass-types';
          requestData = { 
            name: newProduct.name,
            sqftPrice: 0, // You might need to add this to your form
            sqftMinimum: 0 // You might need to add this to your form
          };
          break;
        case 'manufacturer':
          endpoint = '/api/manufacturers';
          requestData = { 
            name: newProduct.name
          };
          break;
      }
      
      // Make API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      const createdProduct = await response.json();
      
      // Add type field to created product for our local state
      const productWithType = {
        ...createdProduct,
        type: newProduct.type,
        // Map active to available if doorStyle
        active: newProduct.type === 'doorStyle' ? createdProduct.available : true,
        description: newProduct.description || '',
        manufacturer: newProduct.manufacturer || '',
        sqftPrice: newProduct.sqftPrice || 0
      };
      
      // Update local state with the new product
      setProducts([...products, productWithType]);
      
      // Reset form and close modal
      setShowAddModal(false);
      setNewProduct({
        id: '',
        name: '',
        type: 'doorStyle',
        active: true,
        description: '',
        imageUrl: '',
        manufacturer: '',
        sqftPrice: 0
      });
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Debug info:</p>
            <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
            <p>isAdmin: {isAdmin ? 'true' : 'false'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Product Management</h1>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Search</label>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
            >
              <option value="">All Types</option>
              <option value="doorStyle">Door Styles</option>
              <option value="finish">Finishes</option>
              <option value="glassType">Glass Types</option>
              <option value="manufacturer">Manufacturers</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
            >
              Add New Product
            </button>
          </div>
        </div>
        
        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl text-gray-800">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Type</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Details</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {product.type === 'doorStyle' && 'Door Style'}
                      {product.type === 'finish' && 'Finish'}
                      {product.type === 'glassType' && 'Glass Type'}
                      {product.type === 'manufacturer' && 'Manufacturer'}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {product.type === 'finish' && (
                        <div>
                          <div><span className="font-medium">Manufacturer:</span> {product.manufacturer}</div>
                          <div><span className="font-medium">Price:</span> ${product.sqftPrice?.toFixed(2)}/sqft</div>
                        </div>
                      )}
                      {product.type === 'glassType' && product.description}
                      {(product.type === 'doorStyle' || product.type === 'manufacturer') && product.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                        ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-700 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className={product.active ? "text-red-600 hover:text-red-800 font-medium" : "text-green-600 hover:text-green-800 font-medium"}
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Type</label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) => setEditingProduct({...editingProduct, type: e.target.value as any})}
                    className="w-full p-2 border rounded text-gray-800"
                    disabled
                  >
                    <option value="doorStyle">Door Style</option>
                    <option value="finish">Finish</option>
                    <option value="glassType">Glass Type</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                
                {editingProduct.type === 'finish' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">Manufacturer</label>
                      <select
                        value={editingProduct.manufacturer || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, manufacturer: e.target.value})}
                        className="w-full p-2 border rounded text-gray-800"
                        required
                      >
                        <option value="">Select a manufacturer</option>
                        {manufacturers.map((manufacturer) => (
                          <option key={manufacturer.id} value={manufacturer.name}>
                            {manufacturer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">Price per Square Foot</label>
                      <input
                        type="number"
                        value={editingProduct.sqftPrice || 0}
                        onChange={(e) => setEditingProduct({...editingProduct, sqftPrice: parseFloat(e.target.value)})}
                        className="w-full p-2 border rounded text-gray-800"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </>
                )}
                
                {editingProduct.type === 'doorStyle' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editingProduct.active}
                      onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-800">
                      Available
                    </label>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Description</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value as any})}
                    className="w-full p-2 border rounded text-gray-800"
                  >
                    <option value="doorStyle">Door Style</option>
                    <option value="finish">Finish</option>
                    <option value="glassType">Glass Type</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>
                
                {newProduct.type === 'finish' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">Manufacturer</label>
                      <select
                        value={newProduct.manufacturer || ''}
                        onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
                        className="w-full p-2 border rounded text-gray-800"
                        required
                      >
                        <option value="">Select a manufacturer</option>
                        {manufacturers.map((manufacturer) => (
                          <option key={manufacturer.id} value={manufacturer.name}>
                            {manufacturer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">Price per Square Foot</label>
                      <input
                        type="number"
                        value={newProduct.sqftPrice || 0}
                        onChange={(e) => setNewProduct({...newProduct, sqftPrice: parseFloat(e.target.value)})}
                        className="w-full p-2 border rounded text-gray-800"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </>
                )}
                
                {newProduct.type === 'doorStyle' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newActive"
                      checked={newProduct.active}
                      onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="newActive" className="ml-2 block text-sm text-gray-800">
                      Available
                    </label>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Description</label>
                  <textarea
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 border rounded text-gray-800"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  disabled={!newProduct.name}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 